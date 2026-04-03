document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const callsModal = document.getElementById('callsModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const callActionBtn = document.getElementById('callActionBtn');
    const timerDisplay = document.getElementById('callTimer');
    const finishCallBtn = document.getElementById('finishCallBtn');
    
    // Sidebar & Navigation
    const navItems = document.querySelectorAll('.nav-item[data-view]');
    const views = document.querySelectorAll('.content-view');
    const productsModal = document.getElementById('productsModal');
    const openProductsView = document.getElementById('openProductsView');
    const productsNavBtns = document.querySelectorAll('[data-tab-products]');
    const productsTabPanes = document.querySelectorAll('.products-tab-pane');
    
    // Tabs logic (Calls Modal)
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Finish Call Overlay elements
    const finishOverlay = document.getElementById('finishOverlay');
    const cancelFinishBtn = document.getElementById('cancelFinishBtn');
    const confirmFinishBtn = document.getElementById('confirmFinishBtn');
    
    // Product Edit Modal Elements
    const productEditModal = document.getElementById('productEditModal');
    const productEditForm = document.getElementById('productEditForm');
    const closeProductEditModal = document.getElementById('closeProductEditModal');
    const createNewProductBtn = document.getElementById('createNewProductBtn');
    const deleteProductBtn = document.getElementById('deleteProductBtn');
    
    // Call Type Selector
    const callTypeSelector = document.querySelector('.call-type-selector select');

    // State
    let timerInterval = null;
    let seconds = 0;
    let callActive = false;
    let currentAthlete = { id: 'a-1', name: 'Lukas Müller', email: 'lukas.mueller@example.com' };
    let allProducts = [];

    // --- Backend Communication Helpers ---
    const runBackend = (fnName, ...args) => {
        return new Promise((resolve, reject) => {
            if (typeof google !== 'undefined' && google.script && google.script.run) {
                google.script.run
                    .withSuccessHandler(resolve)
                    .withFailureHandler(reject)[fnName](...args);
            } else {
                console.warn(`Mocking backend call: ${fnName}`, args);
                // Simulate network delay
                setTimeout(() => {
                    if (fnName === 'api_getAthletes') resolve([{ id: 'a-1', name: 'Lukas Müller', email: 'lukas.mueller@example.com', sport: 'Kraftsport' }]);
                    if (fnName === 'api_getProducts') resolve([{ product_id: 'p-1', name: 'Premium Bundle', price_base: 199 }, { product_id: 'p-2', name: 'Basis Paket', price_base: 99 }]);
                    if (fnName === 'api_saveCallConclusion') resolve({ status: 'success' });
                    resolve(null);
                }, 500);
            }
        });
    };

    // Initialize Data
    async function initData() {
        try {
            const athletes = await runBackend('api_getAthletes');
            console.log('Athletes loaded:', athletes);
            
            allProducts = await runBackend('api_getProducts');
            renderProducts(allProducts);
        } catch (err) {
            console.error('Failed to init data:', err);
        }
    }

    function renderProducts(products) {
        const pkgList = document.querySelector('.pkg-list');
        const leistungenList = document.getElementById('leistungenList');
        
        if (!products || products.length === 0) return;

        // Populate Package Selection list (for Calls modal)
        if (pkgList) {
            pkgList.innerHTML = products.map((pkg, idx) => `
                <div class="pkg-item ${idx === 0 ? 'selected' : ''}" data-id="${pkg.product_id}">
                    <span>${pkg.name}</span>
                    <strong>${pkg.price_base}€/Mo</strong>
                </div>
            `).join('');

            const pkgItems = document.querySelectorAll('.pkg-item');
            pkgItems.forEach(item => {
                item.addEventListener('click', () => {
                    pkgItems.forEach(i => i.classList.remove('selected'));
                    item.classList.add('selected');
                });
            });
        }

        // Populate Products Table (for Products modal)
        if (leistungenList) {
            const services = products.filter(p => p.type === 'Leistung' || !p.type);
            
            leistungenList.innerHTML = services.map(p => `
                <tr>
                    <td>
                        <div class="product-name-cell">
                            <div class="product-icon ${p.category === 'Ernährung' ? 'orange' : (p.category === 'Gesundheit' ? 'purple' : 'teal')}">${(p.name || 'P')[0]}</div>
                            <span>${p.name}</span>
                        </div>
                    </td>
                    <td><span class="badge category-badge">${p.category || 'Allgemein'}</span></td>
                    <td>${p.type || 'Leistung'}</td>
                    <td>${p.price_base || 0},00 €</td>
                    <td>${p.frequency || 'Einmalig'}</td>
                    <td><span class="status-indicator active">Aktiv</span></td>
                    <td class="actions-cell">
                        <button class="icon-btn sm edit-product-btn" data-id="${p.product_id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                    </td>
                </tr>
            `).join('');

            document.querySelectorAll('.edit-product-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const prod = allProducts.find(p => p.product_id === btn.getAttribute('data-id'));
                    openProductEditModal(prod);
                });
            });
        }

        // Populate Packages Grid
        const pkgGrid = document.querySelector('.packages-grid');
        if (pkgGrid) {
            const packages = products.filter(p => p.type === 'Paket' || p.type === 'Paket (Bundle)');
            if (packages.length > 0) {
                pkgGrid.innerHTML = packages.map(pkg => `
                    <div class="package-card">
                        <div class="package-header">
                            <h3>${pkg.name}</h3>
                            <span class="badge price-badge">${pkg.price_base} €${pkg.frequency === 'Monatlich' ? '/Mo' : ''}</span>
                        </div>
                        <p class="package-desc">${pkg.description || 'Keine Beschreibung verfügbar.'}</p>
                        <div class="package-footer">
                            <span class="status-indicator active">Aktiv</span>
                            <div class="actions">
                                <button class="btn btn-secondary sm edit-package-btn" data-id="${pkg.product_id}">Bearbeiten</button>
                            </div>
                        </div>
                    </div>
                `).join('');
                
                document.querySelectorAll('.edit-package-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const prod = allProducts.find(p => p.product_id === btn.getAttribute('data-id'));
                        openProductEditModal(prod);
                    });
                });
            }
        }
    }

    initData();

    // --- SPA Navigation Logic ---
    function navigateTo(viewId) {
        views.forEach(v => v.classList.remove('active'));
        navItems.forEach(n => n.classList.remove('active'));

        const targetView = document.getElementById(`view-${viewId}`);
        const targetNavItem = document.querySelector(`.nav-item[data-view="${viewId}"]`);

        if (targetView) {
            targetView.classList.add('active');
        }
        if (targetNavItem) {
            targetNavItem.classList.add('active');
        }

        // Special handling for legacy views that are now modals or sections
        if (viewId === 'products') {
            // Option 1: Open existing products modal
            productsModal.classList.remove('hidden');
            // Option 2: Redirect back to dashboard active item to avoid 'empty' view
            // (We'll keep it as a view placeholder for now)
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const viewId = item.getAttribute('data-view');
            navigateTo(viewId);
        });
    });

    // Handle initial Products button from before
    if (openProductsView) {
        openProductsView.addEventListener('click', () => {
            productsModal.classList.remove('hidden');
        });
    }

    // Modal Close logic
    const closeProductsModal = document.getElementById('closeProductsModal');
    if (closeProductsModal) {
        closeProductsModal.addEventListener('click', () => productsModal.classList.add('hidden'));
    }

    // --- Product Edit Handlers ---
    if (createNewProductBtn) {
        createNewProductBtn.addEventListener('click', () => openProductEditModal());
    }

    if (closeProductEditModal) {
        closeProductEditModal.addEventListener('click', () => productEditModal.classList.add('hidden'));
    }

    function openProductEditModal(product = null) {
        document.getElementById('productEditTitle').textContent = product ? 'Leistung bearbeiten' : 'Neue Leistung erstellen';
        document.getElementById('editProductId').value = product ? product.product_id : '';
        document.getElementById('editProductName').value = product ? product.name : '';
        document.getElementById('editProductCategory').value = product ? product.category : 'Training';
        document.getElementById('editProductType').value = product ? product.type : 'Leistung';
        document.getElementById('editProductPrice').value = product ? product.price_base : '';
        document.getElementById('editProductFrequency').value = product ? product.frequency : 'Einmalig';
        document.getElementById('editProductDesc').value = product ? (product.description || '') : '';
        
        deleteProductBtn.style.display = product ? 'block' : 'none';
        productEditModal.classList.remove('hidden');
    }

    productEditForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            product_id: document.getElementById('editProductId').value,
            name: document.getElementById('editProductName').value,
            category: document.getElementById('editProductCategory').value,
            type: document.getElementById('editProductType').value,
            price_base: document.getElementById('editProductPrice').value,
            frequency: document.getElementById('editProductFrequency').value,
            description: document.getElementById('editProductDesc').value
        };

        try {
            const res = await runBackend('api_saveProduct', formData);
            if (res.status === 'success') {
                productEditModal.classList.add('hidden');
                initData(); // Refresh list
            }
        } catch (err) {
            alert('Fehler beim Speichern: ' + err.message);
        }
    });

    deleteProductBtn.addEventListener('click', async () => {
        const id = document.getElementById('editProductId').value;
        if (!id || !confirm('Möchtest du dieses Produkt wirklich löschen?')) return;

        try {
            const res = await runBackend('api_deleteProduct', id);
            if (res.status === 'success') {
                productEditModal.classList.add('hidden');
                initData();
            }
        } catch (err) {
            alert('Fehler beim Löschen: ' + err.message);
        }
    });

    const totalInput = document.querySelector('.vereinbarung-form input[placeholder="Summe"]'); // Update selector if needed
    // Actually the HTML doesn't have a placeholder for Summe, let's use the last input-dark w-100
    const totalInputArea = document.querySelector('.vereinbarung-form .w-100');
    if (totalInputArea) {
        totalInputArea.addEventListener('input', (e) => {
            // Summary doesn't have a specific 'Total' spot yet, but we could add it or just log it
            // For now, let's just ensure the input works and is ready for the backend
        });
    }

    if (callTypeSelector) {
        callTypeSelector.addEventListener('change', (e) => {
            updateCallMask(e.target.value);
        });
    }

    // Real-time Summary Binding
    const goalLargeInput = document.querySelector('.goal-card-large .invisible-input');
    const summaryGoals = document.querySelector('.summary-section:nth-of-type(2) .summary-list');
    if (goalLargeInput && summaryGoals) {
        goalLargeInput.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            summaryGoals.innerHTML = val ? `<li>${val}</li>` : '<li></li>';
        });
    }

    const agreeStartInput = document.querySelector('.vereinbarung-form .input-dark');
    const summaryStartVal = document.querySelector('.summary-section .date-input input');
    if (agreeStartInput && summaryStartVal) {
        agreeStartInput.addEventListener('input', (e) => {
            summaryStartVal.value = e.target.value;
        });
    }

    // --- Calls Modal Spektrum Selection ---
    function renderCallsSpektrum() {
        // Target specifically the column content boxes
        const boxes = document.querySelectorAll('#tab-vereinbarung .col .content-box');
        if (boxes.length < 2) return;
        const pkgBox = boxes[0];
        const svcBox = boxes[1];
        const summaryList = document.querySelector('.summary-section:nth-of-type(3) .summary-list');
        
        pkgBox.innerHTML = '';
        svcBox.innerHTML = '';

        (allProducts || []).forEach(prod => {
            const row = document.createElement('label');
            row.style.display = 'block';
            row.style.margin = '4px 0';
            row.style.fontSize = '0.9rem';
            row.innerHTML = `<input type="checkbox" data-name="${prod.name}"> ${prod.name}`;
            
            row.querySelector('input').addEventListener('change', () => {
                const checked = Array.from(document.querySelectorAll('#tab-vereinbarung input[type="checkbox"]:checked'));
                summaryList.innerHTML = checked.map(c => `<li>${c.getAttribute('data-name')}</li>`).join('') || '<li></li>';
            });

            if (prod.type === 'Paket') pkgBox.appendChild(row);
            else svcBox.appendChild(row);
        });
    }

    // Call this whenever products are loaded
    const originalInitData = initData;
    window.initData = async () => {
        await originalInitData();
        renderCallsSpektrum();
    };

    const triggerAthleteApp = document.getElementById('triggerAthleteApp');
    const athleteAppCodeArea = document.getElementById('athleteAppCodeArea');
    const generateCodeBtn = document.getElementById('generateCodeBtn');
    const activationCodeDisplay = document.getElementById('activationCodeDisplay');

    if (triggerAthleteApp) {
        triggerAthleteApp.addEventListener('change', (e) => {
            if (e.target.checked) {
                athleteAppCodeArea.classList.remove('hidden');
            } else {
                athleteAppCodeArea.classList.add('hidden');
            }
        });
    }

    if (generateCodeBtn) {
        generateCodeBtn.addEventListener('click', async () => {
            generateCodeBtn.disabled = true;
            try {
                // In a real app, this would call the backend to generate and store a code
                const res = await runBackend('api_generateActivationCode', currentAthlete.id);
                if (res && res.code) {
                    activationCodeDisplay.textContent = res.code;
                } else {
                    // Fallback mock
                    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
                    activationCodeDisplay.textContent = mockCode;
                }
            } catch (err) {
                console.error('Failed to generate code:', err);
            } finally {
                generateCodeBtn.disabled = false;
            }
        });
    }

    function updateCallMask(type) {
        const mask = document.getElementById('callMaskContent');
        if (!mask) return;

        // Simple dynamic mask content based on type
        if (type === 'Check-in') {
            document.querySelector('[data-tab="vereinbarung"]').style.display = 'none';
            // Switch to Goals tab if we were on Agreement
            if (document.querySelector('.nav-btn.active').getAttribute('data-tab') === 'vereinbarung') {
                document.querySelector('[data-tab="ziele"]').click();
            }
        } else {
            document.querySelector('[data-tab="vereinbarung"]').style.display = 'block';
        }
        
        console.log('Call Mask updated for:', type);
    }

    // Calls Modal Handlers
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            callsModal.classList.remove('hidden');
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            callsModal.classList.add('hidden');
            resetTimer();
        });
    }

    // Modal Tabs logic (Calls Modal)
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            navButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`tab-${tabId}`).classList.add('active');
        });
    });

    // Products Tab Switching
    productsNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab-products');
            
            productsNavBtns.forEach(b => b.classList.remove('active'));
            productsTabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`products-tab-${tabId}`).classList.add('active');
        });
    });

    // Close on overlay click
    [callsModal, productsModal, finishOverlay].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                if (modal === callsModal) resetTimer();
            }
        });
    });

    // Call Action Toggle (Start/Stop)
    callActionBtn.addEventListener('click', () => {
        if (!callActive) {
            startTimer();
            callActionBtn.textContent = 'Call beenden';
            callActionBtn.classList.replace('btn-primary-pulse', 'btn-danger');
            callActionBtn.classList.remove('btn-pulse');
            callActive = true;
        } else {
            stopTimer();
            callActionBtn.textContent = 'Call gestoppt';
            callActionBtn.classList.replace('btn-danger', 'btn-secondary');
            callActive = false;
        }
    });

    // Finish Call Overlay
    finishCallBtn.addEventListener('click', () => {
        if (callActive) {
            stopTimer();
            callActionBtn.textContent = 'Call beendet';
            callActionBtn.classList.replace('btn-danger', 'btn-secondary');
            callActive = false;
        }
        finishOverlay.classList.remove('hidden');
    });

    cancelFinishBtn.addEventListener('click', () => {
        finishOverlay.classList.add('hidden');
    });

    confirmFinishBtn.addEventListener('click', async () => {
        const selectedPkg = document.querySelector('.pkg-item.selected');
        const triggers = {
            sendActivation: document.querySelectorAll('.trigger-list input[type="checkbox"]')[0].checked,
            onboardingProposal: document.querySelectorAll('.trigger-list input[type="checkbox"]')[1].checked,
            createContract: document.querySelectorAll('.trigger-list input[type="checkbox"]')[2].checked,
            createLog: document.querySelectorAll('.trigger-list input[type="checkbox"]')[3].checked
        };

        const callData = {
            athleteId: currentAthlete.id,
            type: 'Erstgespräch',
            duration: timerDisplay.textContent,
            productId: selectedPkg ? selectedPkg.getAttribute('data-id') : null,
            triggers: triggers,
            summary: {
                pkgName: selectedPkg ? selectedPkg.querySelector('span').textContent : 'N/A',
                timestamp: new Date().toISOString()
            }
        };

        confirmFinishBtn.textContent = 'Speichere...';
        confirmFinishBtn.disabled = true;

        try {
            const res = await runBackend('api_saveCallConclusion', callData);
            if (res && res.status === 'success') {
                alert('Call-Daten erfolgreich gespeichert und Prozesse angestoßen.');
                finishOverlay.classList.add('hidden');
                callsModal.classList.add('hidden');
                resetTimer();
            } else {
                throw new Error(res ? res.message : 'Unbekannter Fehler');
            }
        } catch (err) {
            alert('Fehler beim Speichern: ' + err.message);
        } finally {
            confirmFinishBtn.textContent = 'Prozesse starten';
            confirmFinishBtn.disabled = false;
        }
    });

    // Tab Switching
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            navButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`tab-${tabId}`).classList.add('active');
        });
    });

    // Timer functions
    function startTimer() {
        if (timerInterval) return;
        timerInterval = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    function resetTimer() {
        stopTimer();
        seconds = 0;
        timerDisplay.textContent = '00:00';
    }
});

/* ==========================================
   AGENT WORKING ZONES (JS)
   Each agent works ONLY within their assigned section below.
   DO NOT modify logic outside of your assigned section.
   Use the existing 'runBackend' function for backend calls.
   ========================================== */

// \[AGENT-1: DASHBOARD - START\]
// Dashboard initialization and event listeners

const dashboardContext = {
    userName: 'Michael',
    openCheckIns: 5
};

const athleteData = [
    { id: 'a-1', name: 'Anna Müller', type: 'Erstgespräch', time: '17:30', tag: 'CALL', tagClass: 'tag-call' },
    { id: 'a-2', name: 'Lukas Schmidt', type: 'Onboarding', time: '18:45', tag: 'ONBOARD', tagClass: 'tag-onboard' },
    { id: 'a-3', name: 'Tom Bauer', type: 'Review Call', time: '19:30', tag: 'CALL', tagClass: 'tag-call' }
];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Upgrade Welcome Banner securely
    const welcomeTitle = document.getElementById('welcome-title');
    const welcomeSubtitle = document.getElementById('welcome-subtitle');

    if (welcomeTitle) {
        welcomeTitle.textContent = `Guten Morgen, ${dashboardContext.userName}!`;
    }
    if (welcomeSubtitle) {
        welcomeSubtitle.textContent = `Du hast heute ${athleteData.length} anstehende Calls und ${dashboardContext.openCheckIns} offene Check-Ins.`;
    }

    // 2. Implement "Today's To-Dos" list securely (secure DOM methods)
    const todoListContainer = document.getElementById('todo-list-container');
    const todoCountBadge = document.getElementById('todo-count-badge');
    const openModalBtn = document.getElementById('openModalBtn');

    if (todoCountBadge) {
        todoCountBadge.textContent = athleteData.length.toString();
    }

    if (todoListContainer) {
        while (todoListContainer.firstChild) { todoListContainer.removeChild(todoListContainer.firstChild); } // clear placeholder

        athleteData.forEach(athlete => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'todo-item';

            const infoDiv = document.createElement('div');
            infoDiv.className = 'todo-info';

            const nameSpan = document.createElement('span');
            nameSpan.className = 'todo-name';
            nameSpan.textContent = athlete.name;

            const metaSpan = document.createElement('span');
            metaSpan.className = 'todo-meta';
            metaSpan.textContent = `${athlete.type} • ${athlete.time}`;

            infoDiv.appendChild(nameSpan);
            infoDiv.appendChild(metaSpan);

            const tagSpan = document.createElement('span');
            tagSpan.className = `tag ${athlete.tagClass}`;
            tagSpan.textContent = athlete.tag;

            itemDiv.appendChild(infoDiv);
            itemDiv.appendChild(tagSpan);

            // Connect to modal logic
            itemDiv.addEventListener('click', () => {
                const athleteNameEl = document.getElementById('athleteName');
                if (athleteNameEl) athleteNameEl.textContent = athlete.name;
                currentAthlete = { id: athlete.id, name: athlete.name, email: athlete.name.toLowerCase().split(' ')[0] + '@example.com' };
                if (openModalBtn) openModalBtn.click();
            });

            todoListContainer.appendChild(itemDiv);
        });
    }

    // 3. Connect "Start Next Call" button securely
    if (openModalBtn && athleteData.length > 0) {
        openModalBtn.addEventListener('click', (e) => {
            // If the user clicks the button directly without clicking a specific todo item,
            // we default to the first athlete in the list
            const athleteNameEl = document.getElementById('athleteName');
            // Check if it's currently showing default or empty, or just always set it to the next call if this button is clicked
            if (athleteNameEl && e.isTrusted) { // e.isTrusted is true if user clicked directly, false if triggered programmatically
                 athleteNameEl.textContent = athleteData[0].name;
                 currentAthlete = { id: athleteData[0].id, name: athleteData[0].name, email: athleteData[0].name.toLowerCase().split(' ')[0] + '@example.com' };
            }
        });
    }
});
// [AGENT-1: DASHBOARD - END]

// [AGENT-2: ATHLETES - START]
// Athlete View logic, search, and detail modal triggers
// [AGENT-2: ATHLETES - END]

// [AGENT-3: CHECK-INS - START]
// Check-In rendering and review submission logic
// [AGENT-3: CHECK-INS - END]

// [AGENT-4: INVOICES - START]
// Invoice list rendering and management logic
// [AGENT-4: INVOICES - END]

