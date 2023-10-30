 var nonRefundableTaxCodesForTaxRefund = ["YQ", "YR", "US", "XF", "PI", "S4", "EQ", "E2", "ED", "L8", "O7", "I6", "N7", "N9", "PE", "CR", "BU", "DI", "FV", "FW", "BZ", "XL", "PH", "E3", "PA", "OU", "K3", "J9", "ZP"];
        var nonRefundableTaxCodesForNormalRefund = ["PI", "S4", "EQ", "E2", "ED", "L8", "O7", "I6", "N7", "N9", "PE", "CR", "BU", "DI", "FV", "FW", "BZ", "XL", "PH", "E3", "PA", "OU", "K3", "J9",];

        var selectedRefundType = 'tax'; // Default to 'tax'

        function setRefundType(refundType) {
            selectedRefundType = refundType;
        }

        function calculateRefund() {
            // Get the breakdown from the user input
            var breakdown = document.getElementById("breakdown").value;

            // Split the breakdown into individual items
            var items = breakdown.split(/\s+/);

            // Initialize refund amount
            var refundAmount = 0.0;

            // Initialize refundable and non-refundable tax breakdowns
            var refundableTaxes = '';
            var nonRefundableTaxes = '';

            // Get the refund type
            var refundType = document.getElementById("refundType").value;

            // Find the fare amount
            var fareAmount = 0.0;
            for (var i = 0; i < items.length; i++) {
                if (items[i] === "FARE") {
                    var amount = parseFloat(items[i + 2]);

                    if (!isNaN(amount)) {
                        fareAmount = amount;
                        break;
                    }
                }
            }

            // Get the penalty input
            var penaltyInput = document.getElementById("penaltyInput");
            var penaltyAmount = parseFloat(penaltyInput.value) || 0;

            // Calculate the refund based on the refund type and categorize taxes
            for (var i = 0; i < items.length; i++) {
                if (items[i] === "TAX") {
                    var taxCode = items[i + 1].slice(-2); // Extract the last two characters as the tax code
                    var amount = parseFloat(items[i + 1]);

                    if (!isNaN(amount) && taxCode) {
                        if ((refundType === "tax" && nonRefundableTaxCodesForTaxRefund.includes(taxCode)) ||
                            (refundType === "normal" && nonRefundableTaxCodesForNormalRefund.includes(taxCode))) {
                            nonRefundableTaxes += 'TAX ' + amount.toFixed(2) + taxCode + '\n';
                        } else {
                            refundableTaxes += 'TAX ' + amount.toFixed(2) + taxCode + '\n';
                            refundAmount += amount;
                        }
                    }
                }
            }

            // Calculate the refund amount based on the refund type
            if (refundType === "normal") {
                refundAmount = fareAmount + refundAmount - penaltyAmount;
            }

            // Display the refundable and non-refundable tax breakdowns
            document.getElementById("refundableTaxes").textContent = refundableTaxes;
            document.getElementById("nonRefundableTaxes").textContent = nonRefundableTaxes;

            // Display the refund amount
            document.getElementById("refundAmount").textContent = "Refund Amount: " + refundAmount.toFixed(2);
            var refundAmountText = "Refund Amount: " + refundAmount.toFixed(2);
            var coloredRefundAmountText = refundAmountText.replace(/\d+\.\d+/, '<span style="color: #EE6C4D;">$&</span>');
            document.getElementById("refundAmount").innerHTML = coloredRefundAmountText;
        }
        
        function generateEmailTemplate() {
            // Calculate the refund first
            calculateRefund();
            
            // Get the selected refund type
            var refundType = document.getElementById("refundType").value;
             var breakdown = document.getElementById("breakdown").value;
                var refundAmount = document.getElementById("refundAmount").textContent;
                var penaltyInput = document.getElementById("penaltyInput");
                var penaltyAmount = parseFloat(penaltyInput.value) || 0;;
                var netAmount = fareAmount + refundAmount
            
            if (refundType === "tax") {
                // Create an email template with your original layout and styling
                var emailTemplate = `
                    <html>
                    <head>
                        <style>
                            /* Add your CSS styling here */
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="subject">
                                <p>[SS]Tax Refund Request PNR: ${refundAmount} USD/CAD</p>
                            </div>
                            <br>
                            <div class="content">
                                <p>Dear Team,</p>
                                <br>
                                <p>PNR:</p>
                                <p>TKT: </p>
                                <p>NAME: </p>
                                <br>
                                <p>Please process a ${refundType} refund per the following breakdown:</p>
                                <br>
                                <p>Refundable Taxes:</p>
                                <pre>${document.getElementById("refundableTaxes").textContent}</pre>
                                <br>
                                <p>Non-Refundable Taxes:</p>
                                <pre>${document.getElementById("nonRefundableTaxes").textContent}</pre>
                                <p class="refund-amount">${refundAmount}</p>
                                <br>
                                <p>Thank you in advance.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `;
                
                // Display the email template in the container div
                document.getElementById("emailTemplateContainer").innerHTML = emailTemplate;
            } else if (refundType === "normal") {
                // Create an email template for normal refunds
                var emailTemplate = `
                <html>
            <head>
                <style>
                    /* Add your CSS styling here */
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="subject">
                        <p>[SS]In-house/Monetary Refund Request PNR: ${refundAmount} USD/CAD</p>
                    </div>
                    <br>
                    <div class="content">
                        <p>Dear Team,</p>
                        <br>
                        <p>PNR:</p>
                        <p>TKT: </p>
                        <p>NAME: </p>
                        <br>
                        <p>Please process an in-house/monetary refund per following breakdown:</p>
                        <br>
                        <p>Net Price: ${netAmount} </p>
                        <p>Penalty: ${penaltyAmount}
                        <p>Non Ref taxes: <!-- Insert the non-refundable taxes breakdown here --> </p>
                        <p>Amount to be refunded: ${refundAmount}</p>
                        <br>
                        <p>Thank you in advance.</p>
                    </div>
                </div>
            </body>
            </html>
            `;
                document.getElementById("emailTemplateContainer").innerHTML = emailTemplate;
            } else {
                // Clear the email template container for other refund types
                document.getElementById("emailTemplateContainer").innerHTML = "";
            }
        }