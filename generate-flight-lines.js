const input = `TKT: 079 7956 834286     NAME: MCMURRAY/NATI                    
 CC: CAXXXXXXXXXXXX5525                            
ISSUED: 16OCT23          FOP:CAXXXXXXXXXXXX5525-JMOMAB/CC       
PSEUDO: 1O3K  PLATING CARRIER: PR  ISO: US  IATA: 05578602   
   USE  CR FLT  CLS  DATE BRDOFF TIME  ST F/B        FARE   CPN
   OPEN PR  103  B  03DEC LAXMNL 1015P OK BXFUS              1
                                                   NVA03MAR
   OPEN PR  112  K  24FEB MNLLAX 1120A OK KKWFUS             2
                                          NVB06DEC NVA03MAR
 
FARE USD 1135.00 TAX    42.20 US TAX   434.60 XT
TOTAL USD 1611.80
   ECONOMY VALUE-NONEND/PNLTIES APPLY-PRTL NONREF/ECONOMY SAVER-
   NONEND`;

function generateFlightLines(input) {
  const flightSegments = input.match(/OPEN PR\s+(\d+)\s+(\w)\s+(\d{2}[A-Z]{3})\s+(\d{4}[AP]\s[A-Z]+)\sOK\s(\w)\s+(NVA\d{2}[A-Z]{3})/g);

  if (flightSegments) {
    for (const segment of flightSegments) {
      const [, flightNumber, classCode, departureDate, route, bookingStatus, returnDate] = segment.match(/OPEN PR\s+(\d+)\s+(\w)\s+(\d{2}[A-Z]{3})\s+(\d{4}[AP]\s[A-Z]+)\sOK\s(\w)\s+(NVA\d{2}[A-Z]{3})/);
      const formattedOutput = `$D${route}${departureDate}${bookingStatus}${returnDate}+PR:N:RT-${classCode}:NUC`;
      console.log(formattedOutput);
    }
  }
}

generateFlightLines(input);
