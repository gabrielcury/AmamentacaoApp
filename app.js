$(document).ready(function () {
    loadLastFeeding();

    $("#btn-esquerdo").on("click", function () {
        handleFeeding('Esquerdo');
    });

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
            if (data) {
                const localDate = new Date(data.date).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
                updateInterface(data.lado, localDate);

                if (data.remaining_time > 0) {
                    startCountdown(data.remaining_time);
                    setNotification(data.remaining_time);
                } else {
                    $("#countdown").text('Tempo esgotado!');
                }
            }
        },
        error: function (xhr, status, error) {
            console.error("Erro ao carregar o último registro: " + error);
        }
    });
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

function setNotification(remainingTime) {
    // Check if there are 5 minutes (300 seconds) remaining
    if (remainingTime <= 300) {
        // Set a timeout to trigger the notification
        setTimeout(() => {
            showNotification("Alerta de Alimentação", "Faltam 5 minutos para a próxima alimentação!");
        }, (remainingTime - 300) * 1000); // Convert remaining time to milliseconds
    }
}

function showNotification(title, body) {
    if (Notification.permission === "granted") {
        new Notification(title, { body });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(title, { body });
            }
        });
    }
}
