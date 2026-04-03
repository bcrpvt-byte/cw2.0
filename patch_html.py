import re

with open("CoachApp/index.html", "r") as f:
    content = f.read()

start_marker = "<!-- [AGENT-3: CHECKINS - START] -->"
end_marker = "<!-- [AGENT-3: CHECKINS - END] -->"

replacement = """<!-- [AGENT-3: CHECKINS - START] -->
                <section id="view-checkins" class="content-view">
                    <header class="view-header">
                        <h1>Check-Ins</h1>
                    </header>
                    <div class="card">
                        <table class="ascent-table" id="checkins-table">
                            <thead>
                                <tr>
                                    <th>Datum</th>
                                    <th>Athlet</th>
                                    <th>Status</th>
                                    <th>Aktionen</th>
                                </tr>
                            </thead>
                            <tbody id="checkins-list-body">
                                <!-- Check-Ins will be populated here via JS -->
                            </tbody>
                        </table>
                    </div>

                    <!-- Check-In Review Modal -->
                    <div id="checkinReviewModal" class="modal-overlay hidden" style="z-index: 1200;">
                        <div class="modal-container dark-theme product-edit-size">
                            <header class="modal-header">
                                <h2 id="checkinReviewTitle">Check-In Review</h2>
                                <button id="closeCheckinModal" class="icon-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
                            </header>
                            <div class="modal-body p-2">
                                <div class="checkin-details" id="checkinDetailsContent">
                                    <!-- Populated via JS -->
                                </div>
                                <form id="checkinReviewForm" class="mt-2">
                                    <input type="hidden" id="reviewCheckinId">
                                    <div class="input-stacked">
                                        <label>Feedback / Notizen</label>
                                        <textarea id="reviewFeedback" class="input-dark" rows="4" required></textarea>
                                    </div>
                                    <div class="modal-footer mt-2">
                                        <button type="button" id="markReviewedBtn" class="btn btn-primary">Als geprüft markieren</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
                <!-- [AGENT-3: CHECKINS - END] -->"""

pattern = re.compile(re.escape(start_marker) + ".*?" + re.escape(end_marker), re.DOTALL)
new_content = pattern.sub(replacement, content)

with open("CoachApp/index.html", "w") as f:
    f.write(new_content)

print("index.html patched")
