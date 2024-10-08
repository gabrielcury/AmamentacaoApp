$(document).ready(function () {
    // Inicializa a interface com os dados salvos
    loadLastFeeding();

    // Evento para registrar o lado esquerdo
    $("#btn-esquerdo").on("click", function () {
        handleFeeding('Esquerdo');
    });

    // Evento para registrar o lado direito
    $("#btn-direito").on("click", function () {
        handleFeeding('Direito');
    });
});

async function handleFeeding(side) {
    const lastSide = $("#last-side").text();
    if (lastSide === side) {
        try {
            const result = await Swal.fire({
                title: 'Você já registrou esse lado por último!',
                text: "Deseja registrar o mesmo lado novamente?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não'
            });

            if (result.isConfirmed) {
                registerFeeding(side);
            }
        } catch (e) {
            const confirmed = confirm('Você já registrou esse lado por último! Deseja registrar o mesmo lado novamente?');
            if (confirmed) {
                registerFeeding(side);
            }
        }
    } else {
        registerFeeding(side);
    }
}

function registerFeeding(side) {
    const now = new Date();
    const utcDate = now.toISOString();

    $.ajax({
        url: '/api/save_feeding',
        type: 'POST',
        data: JSON.stringify({
            side: side,
            date: utcDate
        }),
        contentType: 'application/json',
        success: function (response) {
            const localDate = new Date(response.date).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
            updateInterface(side, localDate);
            loadLastFeeding();
        },
        error: function (xhr, status, error) {
            alert("Erro ao salvar o registro: " + error);
        }
    });
}

function updateInterface(side, date) {
    $("#last-side").text(side);
    $("#last-date").text(date);
}

function loadLastFeeding() {
    $.ajax({
        url: '/api/get_last_feeding',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log('Dados recebidos:', data);  // Para verificar os dados recebidos

            if (data && data.date) {
                const localDate = new Date(data.date).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
                updateInterface(data.lado, localDate);

                if (data.remaining_time > 0) {
                    startCountdown(data.remaining_time);
                } else {
                    $("#countdown").text('Tempo esgotado!');
                }
            } else {
                $("#last-side").text('Nenhum');
                $("#last-date").text('-');
                $("#countdown").text('Nenhum registro encontrado.');
            }
        },
        error: function (xhr, status, error) {
            console.error("Erro ao carregar o último registro: " + error);
            $("#countdown").text('Erro ao carregar dados.');
        }
    });
}

function updateInterface(side, date) {
    $("#last-side").text(side);
    $("#last-date").text(date);
}



function startCountdown(seconds) {
    if (window.countdownInterval) {
        clearInterval(window.countdownInterval);
    }

    window.countdownInterval = setInterval(() => {
        seconds--;

        if (seconds <= 0) {
            clearInterval(window.countdownInterval);
            $("#countdown").text('Tempo esgotado!');
        } else {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            $("#countdown").text(`${hours}h ${minutes}m ${secs}s`);
        }
    }, 1000);
}
