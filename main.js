// Enhanced Number Manager Application
class NumberManager {
    constructor() {
        this.numbersArr = [];
        this.total = 0;
        this.sortAscending = true;
        this.showingTotal = false;
        this.isDarkMode = false;
        
        this.initializeElements();
        this.bindEvents();
        this.loadFromStorage();
        this.loadTheme();
        this.updateDisplay();
        this.initializeAnimations();
    }

    initializeElements() {
        // Buttons
        this.btn1 = document.getElementById("btn1");
        this.btn2 = document.getElementById("btn2");
        this.btn3 = document.getElementById("btn3");
        this.btn4 = document.getElementById("btn4");
        this.btnSort = document.getElementById("btnSort");
        this.btnStats = document.getElementById("btnStats");
        this.btnExport = document.getElementById("btnExport");
        this.themeToggle = document.getElementById("themeToggle");

        // Input and Table
        this.txtNum = document.getElementById("txtNum");
        this.tbl = document.getElementById("tblNumbers");

        // Stats elements
        this.countStat = document.getElementById("countStat");
        this.evenStat = document.getElementById("evenStat");
        this.oddStat = document.getElementById("oddStat");

        // Notification
        this.notification = document.getElementById("notification");
    }

    bindEvents() {
        this.btn1.addEventListener("click", () => this.insertNumber());
        this.btn2.addEventListener("click", () => this.clearInput());
        this.btn3.addEventListener("click", () => this.clearAll());
        this.btn4.addEventListener("click", () => this.toggleTotal());
        this.btnSort.addEventListener("click", () => this.sortNumbers());
        this.btnStats.addEventListener("click", () => this.showStatistics());
        this.btnExport.addEventListener("click", () => this.exportData());
        this.themeToggle.addEventListener("click", () => this.toggleTheme());

        this.txtNum.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                this.insertNumber();
            }
        });

        // Auto-save on changes
        window.addEventListener('beforeunload', () => this.saveToStorage());
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey || event.metaKey) {
                switch(event.key) {
                    case 'd':
                        event.preventDefault();
                        this.toggleTheme();
                        break;
                    case 's':
                        event.preventDefault();
                        this.sortNumbers();
                        break;
                    case 'e':
                        event.preventDefault();
                        this.exportData();
                        break;
                }
            }
        });
    }

    showNotification(message, type = 'info') {
        this.notification.textContent = message;
        this.notification.className = `notification ${type} show`;
        
        // Add enhanced entrance animation
        this.notification.style.transform = 'translateX(400px) scale(0.8) rotate(5deg)';
        setTimeout(() => {
            this.notification.style.transform = 'translateX(0) scale(1) rotate(0deg)';
        }, 10);
        
        setTimeout(() => {
            this.notification.style.transform = 'translateX(400px) scale(0.8) rotate(-5deg)';
            setTimeout(() => {
                this.notification.classList.remove('show');
            }, 300);
        }, 3500);
    }

    validateNumber(input) {
        const regex = /^[0-9]+$/;
        return regex.test(input) && parseInt(input) > 0;
    }

    insertNumber() {
        const txtNumber = this.txtNum.value.trim();

        if (!txtNumber) {
            this.showNotification("Please enter a number", "error");
            return;
        }

        if (!this.validateNumber(txtNumber)) {
            this.showNotification("Please input a valid positive number", "error");
            this.clearInput();
            return;
        }

        const num = parseInt(txtNumber);
        this.numbersArr.push(num);
        this.clearInput();
        this.updateDisplay();
        this.saveToStorage();
        
        this.showNotification(`Number ${num} added successfully`, "success");
        console.log("Current numbers:", this.numbersArr);
    }

    clearInput() {
        this.txtNum.value = "";
        this.txtNum.focus();
    }

    clearAll() {
        if (this.numbersArr.length === 0) {
            this.showNotification("No numbers to clear", "info");
            return;
        }

        if (confirm("Are you sure you want to clear all numbers?")) {
            this.numbersArr = [];
            this.total = 0;
            this.showingTotal = false;
            this.updateDisplay();
            this.saveToStorage();
            this.showNotification("All numbers cleared", "success");
        }
    }

    deleteNumber(index) {
        const deletedNumber = this.numbersArr[index];
        this.numbersArr.splice(index, 1);
        this.updateDisplay();
        this.saveToStorage();
        this.showNotification(`Number ${deletedNumber} deleted`, "success");
        console.log("Current numbers:", this.numbersArr);
    }

    editNumber(index) {

        const currentNumber = this.numbersArr[index];
        const editTxt = prompt(`Enter new number (current: ${currentNumber}):`, currentNumber);
        
        if (editTxt === null || editTxt.trim() === "") {
            this.showNotification("Edit cancelled", "info");
            return;
        }

        if (!this.validateNumber(editTxt)) {
            this.showNotification("Please input a valid positive number", "error");
            return;
        }

        const newNumber = parseInt(editTxt);
        this.numbersArr[index] = newNumber;
        this.updateDisplay();
        this.saveToStorage();
        this.showNotification(`Number updated to ${newNumber}`, "success");
        console.log("Current numbers:", this.numbersArr);
    }

    sortNumbers() {
        if (this.numbersArr.length === 0) {
            this.showNotification("No numbers to sort", "info");
            return;
        }

        this.numbersArr.sort((a, b) => this.sortAscending ? a - b : b - a);
        this.sortAscending = !this.sortAscending;
        this.updateDisplay();
        
        const direction = this.sortAscending ? "ascending" : "descending";
        this.showNotification(`Numbers sorted in ${direction} order`, "success");
    }

    toggleTotal() {
        this.showingTotal = !this.showingTotal;
        this.btn4.textContent = this.showingTotal ? "Hide Total" : "Show Total";
        this.updateDisplay();
    }

    showStatistics() {
        if (this.numbersArr.length === 0) {
            this.showNotification("No numbers available for statistics", "info");
            return;
        }

        const stats = this.calculateStatistics();
        const statsMessage = `
            Statistics:
            • Count: ${stats.count}
            • Sum: ${stats.sum}
            • Average: ${stats.average.toFixed(2)}
            • Min: ${stats.min}
            • Max: ${stats.max}
            • Even: ${stats.even}
            • Odd: ${stats.odd}
        `;
        
        alert(statsMessage.trim());
    }

    calculateStatistics() {
        const count = this.numbersArr.length;
        const sum = this.numbersArr.reduce((a, b) => a + b, 0);
        const average = sum / count;
        const min = Math.min(...this.numbersArr);
        const max = Math.max(...this.numbersArr);
        const even = this.numbersArr.filter(n => n % 2 === 0).length;
        const odd = count - even;

        return { count, sum, average, min, max, even, odd };
    }

    exportData() {
        if (this.numbersArr.length === 0) {
            this.showNotification("No data to export", "info");
            return;
        }

        const stats = this.calculateStatistics();
        const exportData = {
            numbers: this.numbersArr,
            statistics: stats,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `numbers_${new Date().getTime()}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showNotification("Data exported successfully", "success");
    }

    updateStats() {
        const stats = this.calculateStatistics();
        this.animateNumber(this.countStat, stats.count);
        this.animateNumber(this.evenStat, stats.even);
        this.animateNumber(this.oddStat, stats.odd);
    }

    animateNumber(element, target) {
        const current = parseInt(element.textContent) || 0;
        const increment = target > current ? 1 : -1;
        const steps = Math.abs(target - current);
        
        if (steps === 0) return;
        
        let step = 0;
        const timer = setInterval(() => {
            step++;
            element.textContent = current + (increment * step);
            
            // Add color animation during counting
            const progress = step / steps;
            const hue = progress * 360;
            element.style.color = `hsl(${hue}, 70%, 50%)`;
            
            if (step >= steps) {
                clearInterval(timer);
                element.textContent = target;
                element.style.color = '';
                // Add enhanced pulse effect
                element.style.transform = 'scale(1.3) rotate(5deg)';
                element.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                setTimeout(() => {
                    element.style.transform = 'scale(1) rotate(0deg)';
                }, 300);
            }
        }, 30);
    }

    updateDisplay() {
        this.clearTable();
        this.updateStats();

        if (this.numbersArr.length === 0) {
            this.showEmptyState();
            this.btn4.style.display = "none";
            this.btnExport.style.display = "none";
            return;
        }

        this.btn4.style.display = "inline-block";
        this.btnExport.style.display = "inline-block";

        // Create table header with enhanced styling
        const headerRow = document.createElement("tr");
        const headers = ["#", "Number", "Type", "Actions"];
        
        headers.forEach((headerText, index) => {
            const th = document.createElement("th");
            th.textContent = headerText;
            th.style.opacity = '0';
            th.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                th.style.transition = 'all 0.5s ease';
                th.style.opacity = '1';
                th.style.transform = 'translateY(0)';
            }, 100 * index);
            headerRow.appendChild(th);
        });
        
        this.tbl.appendChild(headerRow);

        // Calculate total
        this.total = this.numbersArr.reduce((sum, num) => sum + num, 0);

        // Populate table with enhanced animations
        this.numbersArr.forEach((num, index) => {
            const tr = document.createElement("tr");
            tr.style.opacity = '0';
            tr.style.transform = 'translateX(-30px) scale(0.95)';
            
            setTimeout(() => {
                tr.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                tr.style.opacity = '1';
                tr.style.transform = 'translateX(0) scale(1)';
            }, 80 * index);
            
            // Index cell
            const tdIndex = document.createElement("td");
            tdIndex.textContent = index + 1;
            tr.appendChild(tdIndex);

            // Number cell with enhanced styling
            const tdNumber = document.createElement("td");
            tdNumber.className = "number-cell";
            tdNumber.textContent = num;
            tdNumber.style.background = `linear-gradient(135deg, ${this.getNumberColor(num)}, transparent)`;
            tdNumber.style.backgroundClip = 'text';
            tdNumber.style.webkitBackgroundClip = 'text';
            tdNumber.style.webkitTextFillColor = 'transparent';
            tr.appendChild(tdNumber);

            // Type cell with enhanced animations
            const tdType = document.createElement("td");
            const isEven = num % 2 === 0;
            tdType.className = isEven ? "even" : "odd";
            tdType.textContent = isEven ? "EVEN" : "ODD";
            tdType.style.transform = 'scale(0)';
            setTimeout(() => {
                tdType.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                tdType.style.transform = 'scale(1)';
            }, 100 + (80 * index));
            tr.appendChild(tdType);

            // Actions cell with enhanced buttons
            const tdActions = document.createElement("td");
            tdActions.className = "action-buttons";
            
            const btnEdit = document.createElement("button");
            btnEdit.className = "btn-sm btn-warning";
            btnEdit.textContent = "Edit";
            btnEdit.style.transform = 'scale(0)';
            btnEdit.onclick = () => this.editNumber(index);
            
            const btnDelete = document.createElement("button");
            btnDelete.className = "btn-sm btn-danger";
            btnDelete.textContent = "Remove";
            btnDelete.style.transform = 'scale(0)';
            btnDelete.onclick = () => this.deleteNumber(index);
            
            setTimeout(() => {
                btnEdit.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                btnEdit.style.transform = 'scale(1)';
                btnDelete.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                btnDelete.style.transform = 'scale(1)';
            }, 150 + (80 * index));
            
            tdActions.appendChild(btnEdit);
            tdActions.appendChild(btnDelete);
            tr.appendChild(tdActions);

            this.tbl.appendChild(tr);
        });

        // Show total if enabled with animation
        if (this.showingTotal) {
            const totalRow = document.createElement("tr");
            totalRow.className = "total-row";
            totalRow.style.opacity = '0';
            totalRow.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                totalRow.style.transition = 'all 0.5s ease';
                totalRow.style.opacity = '1';
                totalRow.style.transform = 'scale(1)';
            }, 50 * this.numbersArr.length);
            
            const tdTotalLabel = document.createElement("td");
            tdTotalLabel.colSpan = 2;
            tdTotalLabel.textContent = "TOTAL";
            
            const tdTotalValue = document.createElement("td");
            tdTotalValue.textContent = this.total;
            
            const tdEmpty = document.createElement("td");
            
            totalRow.appendChild(tdTotalLabel);
            totalRow.appendChild(tdTotalValue);
            totalRow.appendChild(tdEmpty);
            
            this.tbl.appendChild(totalRow);
        }
    }

    showEmptyState() {
        const emptyRow = document.createElement("tr");
        const emptyCell = document.createElement("td");
        emptyCell.colSpan = 4;
        emptyCell.className = "empty-state";
        emptyCell.innerHTML = `
            <div class="empty-state-icon">🎨</div>
            <div style="font-size: 1.4rem; font-weight: 600; margin-bottom: 15px;">No numbers added yet</div>
            <div style="font-size: 1rem; margin-top: 10px; opacity: 0.7; line-height: 1.5;">
                Start by adding positive numbers using the input field above<br>
                Watch them come to life with beautiful colors and animations!
            </div>
        `;
        emptyRow.appendChild(emptyCell);
        this.tbl.appendChild(emptyRow);
    }

    clearTable() {
        while (this.tbl.hasChildNodes()) {
            this.tbl.removeChild(this.tbl.firstChild);
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('numberManagerData', JSON.stringify({
                numbers: this.numbersArr,
                sortAscending: this.sortAscending
            }));
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    }

    loadFromStorage() {
        try {
            const savedData = localStorage.getItem('numberManagerData');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.numbersArr = data.numbers || [];
                this.sortAscending = data.sortAscending !== undefined ? data.sortAscending : true;
            }
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
        }
    }

    initializeAnimations() {
        // Add entrance animations to stats
        const stats = document.querySelectorAll('.stat');
        stats.forEach((stat, index) => {
            stat.style.opacity = '0';
            stat.style.transform = 'translateY(20px)';
            setTimeout(() => {
                stat.style.transition = 'all 0.5s ease';
                stat.style.opacity = '1';
                stat.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        const body = document.body;
        const themeIcon = this.themeToggle;
        
        if (this.isDarkMode) {
            body.setAttribute('data-theme', 'dark');
            themeIcon.textContent = '☀️';
            this.showNotification('Dark mode enabled', 'info');
        } else {
            body.removeAttribute('data-theme');
            themeIcon.textContent = '🌙';
            this.showNotification('Light mode enabled', 'info');
        }
        
        this.saveTheme();
    }

    saveTheme() {
        localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.isDarkMode = true;
            document.body.setAttribute('data-theme', 'dark');
            this.themeToggle.textContent = '☀️';
        }
    }

    getNumberColor(num) {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
            '#DDA0DD', '#6C5CE7', '#A8E6CF', '#FD79A8', '#FDCB6E',
            '#74B9FF', '#A29BFE', '#FF7675', '#55A3FF', '#FD79A8'
        ];
        return colors[num % colors.length];
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NumberManager();
});