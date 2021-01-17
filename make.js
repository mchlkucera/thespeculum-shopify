const input = `80x60 cm
4,4 cm
5 mm
9,8 kg
50 W
3 W
2 W
110-240 V
IP54
CE, RoHS, FCC
2 years/4 if bought
`;
const rows = [
   "Dimensions",
   "Thickness including the installation parts",
   "Mirror thickness",
   "Weight",
   "Heating system",
   "LED lighting input power",
   "Display input power",
   "Voltage",
   "Protection rating",
   "Certificates",
   "Warranty",
];

console.log("<table><tbody>");
input.split("\n").forEach((line, i) => {
   console.log(`<tr><td>${rows[i]}</td><td>${line}</td></tr>`);
});
console.log("</tbody></table>");
