document.addEventListener("DOMContentLoaded", function() {
    const seatsContainer = document.getElementById('seatsContainer');

    // Create 100 seats initially
    for (let i = 0; i < 100; i++) {
        const seatDiv = document.createElement('div');
        seatDiv.className = 'seat';
        seatDiv.addEventListener('click', function() {
            if (seatDiv.title) {
                showPopup(seatDiv.title);
            }
        });
        seatsContainer.appendChild(seatDiv);
    }

    document.getElementById('fileInput').addEventListener('change', handleFile);
});

function handleFile(event) {
    document.body.classList.add('blurred');

    const file = event.target.files[0];
    const reader = new FileReader();
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop();

    reader.onload = function(e) {
        let data;
        if (fileExtension === 'csv') {
            data = e.target.result;
            processCSVData(data);
        } else if (fileExtension === 'xlsx') {
            const workbook = XLSX.read(e.target.result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            data = XLSX.utils.sheet_to_csv(sheet);
            processCSVData(data);
        }
    };

    if (fileExtension === 'csv') {
        reader.readAsText(file);
    } else if (fileExtension === 'xlsx') {
        reader.readAsBinaryString(file);
    }
}

function processCSVData(data) {
    const lines = data.split('\n');
    const seats = document.querySelectorAll('.seat');

    if (lines.length <= 100) {
        lines.forEach((line, index) => {
            if (index === 0) return; // Skip header row
            const columns = line.split(',');
            const name = columns[0].trim();

            if (seats[index]) {
                seats[index].classList.add('occupied');
                seats[index].title = name;
            }
        });
    } else {
        alert('Oops! You have more guests than the venue arrangement!');
    }

    document.body.classList.remove('blurred');
    document.getElementById('uploadSection').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function showPopup(name) {
    const popup = document.getElementById('popup');
    popup.textContent = name;
    popup.style.display = 'block';
    setTimeout(() => {
        popup.style.display = 'none';
    }, 2000);
}
