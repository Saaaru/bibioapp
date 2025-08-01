-- Seed data for the library system

-- Insert sample library users
INSERT INTO library_user (full_name, email, phone, address, membership_number) VALUES
('Juan Pérez', 'juan.perez@email.com', '+1234567890', 'Calle Principal 123, Ciudad', 'MEM001'),
('María García', 'maria.garcia@email.com', '+1234567891', 'Avenida Central 456, Ciudad', 'MEM002'),
('Carlos López', 'carlos.lopez@email.com', '+1234567892', 'Plaza Mayor 789, Ciudad', 'MEM003'),
('Ana Martínez', 'ana.martinez@email.com', '+1234567893', 'Calle Secundaria 321, Ciudad', 'MEM004'),
('Luis Rodríguez', 'luis.rodriguez@email.com', '+1234567894', 'Boulevard Norte 654, Ciudad', 'MEM005');

-- Insert sample books
INSERT INTO book (title, author, isbn, publication_year, genre, description, total_copies, available_copies, location) VALUES
('El Quijote', 'Miguel de Cervantes', '9788497593798', 1605, 'Novela', 'La obra maestra de la literatura española', 3, 3, 'Estante A1'),
('Cien años de soledad', 'Gabriel García Márquez', '9788497593799', 1967, 'Realismo mágico', 'Una de las obras más importantes de la literatura latinoamericana', 2, 2, 'Estante A2'),
('Don Juan Tenorio', 'José Zorrilla', '9788497593800', 1844, 'Drama romántico', 'Obra teatral clásica española', 1, 1, 'Estante A3'),
('La casa de Bernarda Alba', 'Federico García Lorca', '9788497593801', 1936, 'Drama', 'Tragedia rural española', 2, 2, 'Estante A4'),
('Rayuela', 'Julio Cortázar', '9788497593802', 1963, 'Novela experimental', 'Obra innovadora de la literatura argentina', 1, 1, 'Estante B1'),
('Pedro Páramo', 'Juan Rulfo', '9788497593803', 1955, 'Realismo mágico', 'Novela fundamental de la literatura mexicana', 2, 2, 'Estante B2'),
('Los miserables', 'Victor Hugo', '9788497593804', 1862, 'Novela histórica', 'Obra maestra de la literatura francesa', 3, 3, 'Estante B3'),
('Orgullo y prejuicio', 'Jane Austen', '9788497593805', 1813, 'Novela romántica', 'Clásico de la literatura inglesa', 2, 2, 'Estante B4'),
('1984', 'George Orwell', '9788497593806', 1949, 'Ciencia ficción', 'Distopía política fundamental', 2, 2, 'Estante C1'),
('El señor de los anillos', 'J.R.R. Tolkien', '9788497593807', 1954, 'Fantasía', 'Épica fantástica mundialmente conocida', 3, 3, 'Estante C2'); 