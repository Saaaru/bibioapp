import { protectRoute } from '../shared/auth.js';
import { getActiveLoans, processReturn } from '../api/loanService.js';

async function main() {
    await protectRoute();
    const tableContainer = document.getElementById('loans-table-container');

    // Cargar y renderizar la tabla al iniciar
    await loadAndRenderLoans(tableContainer);

    // Usar delegación de eventos para manejar los clics en los botones de devolución
    tableContainer.addEventListener('click', async (event) => {
        if (event.target && event.target.matches('.return-btn')) {
            const button = event.target;
            const loanId = button.dataset.loanId;
            
            if (confirm('¿Estás seguro de que quieres registrar la devolución de este libro?')) {
                button.disabled = true;
                button.textContent = 'Procesando...';
                try {
                    await processReturn(loanId);
                    // Recargar la tabla para mostrar los datos actualizados
                    await loadAndRenderLoans(tableContainer);
                } catch (error) {
                    alert(`Error: ${error.message}`);
                    button.disabled = false;
                    button.textContent = 'Devolver';
                }
            }
        }
    });
}

async function loadAndRenderLoans(container) {
    container.innerHTML = `<p>Actualizando lista de préstamos...</p>`;
    try {
        const loans = await getActiveLoans();
        renderLoanTable(container, loans);
    } catch (error) {
        container.innerHTML = `<p class="alert-error">No se pudieron cargar los préstamos.</p>`;
    }
}

function renderLoanTable(container, loans) {
    if (loans.length === 0) {
        container.innerHTML = `<p class="text-center">¡Excelente! No hay préstamos activos o vencidos.</p>`;
        return;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Para comparar solo fechas

    const tableRows = loans.map(loan => {
        const dueDate = new Date(loan.due_date + 'T00:00:00'); // Asegurar que se interpreta como fecha local
        const isOverdue = dueDate < today;
        const statusClass = isOverdue ? 'status-overdue' : 'status-active';
        const statusText = isOverdue ? 'VENCIDO' : 'ACTIVO';
        
        return `
            <tr>
                <td>${loan.book.title}</td>
                <td>${loan.library_user.full_name}</td>
                <td>${formatDate(loan.loan_date)}</td>
                <td class="${isOverdue ? 'text-danger' : ''}">${formatDate(loan.due_date)}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td class="text-right">
                    <button class="btn btn-sm btn-outline return-btn" data-loan-id="${loan.id}">Devolver</button>
                </td>
            </tr>
        `;
    }).join('');

    container.innerHTML = `
        <table class="table w-full">
            <thead>
                <tr>
                    <th>Libro</th>
                    <th>Usuario</th>
                    <th>Fecha Préstamo</th>
                    <th>Fecha Vencimiento</th>
                    <th>Estado</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>${tableRows}</tbody>
        </table>
    `;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString + 'T00:00:00').toLocaleDateString('es-ES', options);
}

document.addEventListener('DOMContentLoaded', main);