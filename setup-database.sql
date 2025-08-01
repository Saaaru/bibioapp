-- Script para configurar la base de datos de BiblioApp
-- Ejecuta este script en el SQL Editor de Supabase Dashboard

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create library_user table
CREATE TABLE IF NOT EXISTS library_user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    membership_number VARCHAR(50) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create book table
CREATE TABLE IF NOT EXISTS book (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(13) UNIQUE,
    publication_year INTEGER,
    genre VARCHAR(100),
    description TEXT,
    total_copies INTEGER DEFAULT 1,
    available_copies INTEGER DEFAULT 1,
    location VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create loan table
CREATE TABLE IF NOT EXISTS loan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES book(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES library_user(id) ON DELETE CASCADE,
    loan_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    return_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'RETURNED', 'OVERDUE')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_loan_book_id ON loan(book_id);
CREATE INDEX IF NOT EXISTS idx_loan_user_id ON loan(user_id);
CREATE INDEX IF NOT EXISTS idx_loan_status ON loan(status);
CREATE INDEX IF NOT EXISTS idx_loan_due_date ON loan(due_date);
CREATE INDEX IF NOT EXISTS idx_book_isbn ON book(isbn);
CREATE INDEX IF NOT EXISTS idx_user_email ON library_user(email);

-- Create function to update available_copies when loans are created/updated
CREATE OR REPLACE FUNCTION update_book_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Decrease available copies when a loan is created
        UPDATE book 
        SET available_copies = available_copies - 1,
            updated_at = NOW()
        WHERE id = NEW.book_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle status changes
        IF OLD.status = 'ACTIVE' AND NEW.status = 'RETURNED' THEN
            -- Increase available copies when a book is returned
            UPDATE book 
            SET available_copies = available_copies + 1,
                updated_at = NOW()
            WHERE id = NEW.book_id;
        ELSIF OLD.status = 'RETURNED' AND NEW.status = 'ACTIVE' THEN
            -- Decrease available copies when a returned book is reactivated
            UPDATE book 
            SET available_copies = available_copies - 1,
                updated_at = NOW()
            WHERE id = NEW.book_id;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for loan table
DROP TRIGGER IF EXISTS trigger_update_book_availability ON loan;
CREATE TRIGGER trigger_update_book_availability
    AFTER INSERT OR UPDATE ON loan
    FOR EACH ROW
    EXECUTE FUNCTION update_book_availability();

-- Create RPC function for creating loans and updating stock
CREATE OR REPLACE FUNCTION create_loan_and_update_stock(
    p_book_id UUID,
    p_user_id UUID
)
RETURNS VOID AS $$
DECLARE
    book_record RECORD;
BEGIN
    -- Get book information
    SELECT * INTO book_record FROM book WHERE id = p_book_id;
    
    -- Check if book exists
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Libro no encontrado';
    END IF;
    
    -- Check if book has available copies
    IF book_record.available_copies <= 0 THEN
        RAISE EXCEPTION 'No hay copias disponibles del libro';
    END IF;
    
    -- Check if user has active loans
    IF EXISTS (
        SELECT 1 FROM loan 
        WHERE user_id = p_user_id 
        AND status IN ('ACTIVE', 'OVERDUE')
    ) THEN
        RAISE EXCEPTION 'El usuario ya tiene préstamos activos';
    END IF;
    
    -- Create the loan (trigger will handle stock update)
    INSERT INTO loan (book_id, user_id, due_date)
    VALUES (p_book_id, p_user_id, NOW() + INTERVAL '14 days');
    
END;
$$ LANGUAGE plpgsql;

-- Create function to update loan status to OVERDUE
CREATE OR REPLACE FUNCTION update_overdue_loans()
RETURNS VOID AS $$
BEGIN
    UPDATE loan 
    SET status = 'OVERDUE',
        updated_at = NOW()
    WHERE status = 'ACTIVE' 
    AND due_date < NOW();
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS)
ALTER TABLE library_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE book ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan ENABLE ROW LEVEL SECURITY;

-- Create policies for library_user table
CREATE POLICY "Users can view all library users" ON library_user
    FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert library users" ON library_user
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update library users" ON library_user
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete library users" ON library_user
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for book table
CREATE POLICY "Users can view all books" ON book
    FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert books" ON book
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update books" ON book
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete books" ON book
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for loan table
CREATE POLICY "Users can view all loans" ON loan
    FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert loans" ON loan
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update loans" ON loan
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete loans" ON loan
    FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO library_user (full_name, email, phone, address, membership_number) VALUES
('Juan Pérez', 'juan.perez@email.com', '+1234567890', 'Calle Principal 123, Ciudad', 'MEM001'),
('María García', 'maria.garcia@email.com', '+1234567891', 'Avenida Central 456, Ciudad', 'MEM002'),
('Carlos López', 'carlos.lopez@email.com', '+1234567892', 'Plaza Mayor 789, Ciudad', 'MEM003'),
('Ana Martínez', 'ana.martinez@email.com', '+1234567893', 'Calle Secundaria 321, Ciudad', 'MEM004'),
('Luis Rodríguez', 'luis.rodriguez@email.com', '+1234567894', 'Boulevard Norte 654, Ciudad', 'MEM005');

INSERT INTO book (title, author, isbn, publication_year, genre, description, total_copies, available_copies, location) VALUES
('El Quijote', 'Miguel de Cervantes', '9788497593798', 1605, 'Novela', 'La obra maestra de la literatura española', 3, 3, 'Estante A1'),
('Cien años de soledad', 'Gabriel García Márquez', '9788497593799', 1967, 'Realismo mágico', 'Una de las obras más importantes de la literatura latinoamericana', 2, 2, 'Estante A2'),
('Don Juan Tenorio', 'José Zorrilla', '9788497593800', 1844, 'Drama romántico', 'Obra teatral clásica española', 1, 1, 'Estante A3'),
('La casa de Bernarda Alba', 'Federico García Lorca', '9788497593801', 1936, 'Drama', 'Tragedia rural española', 2, 2, 'Estante A4'),
('Rayuela', 'Julio Cortázar', '9788497593802', 1963, 'Novela experimental', 'Obra innovadora de la literatura argentina', 1, 1, 'Estante B1');

-- Success message
SELECT 'Base de datos configurada exitosamente!' as mensaje; 