 var nonRefundableTaxCodesForTaxRefund = ["YQ", "YR", "US", "XF", "ZP", ];
        var nonRefundableTaxCodesForNormalRefund = ["PI", "S4", "EQ", "E2", "ED", "L8", "O7", "I6", "N7", "N9", "PE", "CR", "BU", "DI", "FV", "FW", "BZ", "XL", "PH", "E3", "PA", "OU", "K3", "J9", "ZP"];

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
        }