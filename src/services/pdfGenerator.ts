import jsPDF from 'jspdf'
import { format } from 'date-fns'

interface CompanyData {
  company_name: string
  company_cui: string
  company_address?: string
  company_email?: string
  company_phone?: string
}

// Helper to add text with word wrap
function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number = 7
): number {
  const lines = doc.splitTextToSize(text, maxWidth)
  doc.text(lines, x, y)
  return y + (lines.length * lineHeight)
}

// ============================================
// GDPR Documents
// ============================================

export function generateGDPRPolicy(companyData: CompanyData): jsPDF {
  const doc = new jsPDF()
  let yPos = 20

  // Title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('POLITICĂ DE CONFIDENȚIALITATE', 105, yPos, { align: 'center' })
  
  yPos += 15
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')

  // Company info
  doc.text(`Companie: ${companyData.company_name}`, 20, yPos)
  yPos += 7
  doc.text(`CUI: ${companyData.company_cui}`, 20, yPos)
  yPos += 7
  doc.text(`Data generării: ${format(new Date(), 'dd.MM.yyyy')}`, 20, yPos)
  yPos += 15

  // Section 1
  doc.setFont('helvetica', 'bold')
  doc.text('1. INTRODUCERE', 20, yPos)
  yPos += 10
  doc.setFont('helvetica', 'normal')
  
  const intro = `Această Politică de Confidențialitate descrie modul în care ${companyData.company_name} (în continuare "noi", "al nostru") colectează, utilizează și protejează datele dumneavoastră cu caracter personal, în conformitate cu Regulamentul (UE) 2016/679 (GDPR) și Legea nr. 190/2018 privind protecția datelor cu caracter personal.`
  
  yPos = addWrappedText(doc, intro, 20, yPos, 170)
  yPos += 10

  // Section 2
  doc.setFont('helvetica', 'bold')
  doc.text('2. DATELE COLECTATE', 20, yPos)
  yPos += 10
  doc.setFont('helvetica', 'normal')

  const dataTypes = [
    'Date de identificare: nume, prenume, CNP',
    'Date de contact: adresă de email, număr de telefon, adresă poștală',
    'Date financiare: informații bancare (când aplicabil)',
    'Date de utilizare: informații despre modul în care utilizați serviciile noastre'
  ]

  dataTypes.forEach(item => {
    yPos = addWrappedText(doc, `• ${item}`, 25, yPos, 165)
    yPos += 5
  })

  yPos += 10

  // Section 3
  doc.setFont('helvetica', 'bold')
  doc.text('3. SCOPUL PRELUCRĂRII', 20, yPos)
  yPos += 10
  doc.setFont('helvetica', 'normal')

  const purposes = [
    'Executarea contractului încheiat cu dumneavoastră',
    'Respectarea obligațiilor legale',
    'Comunicări comerciale (cu consimțământul dumneavoastră)',
    'Îmbunătățirea serviciilor noastre'
  ]

  purposes.forEach(item => {
    yPos = addWrappedText(doc, `• ${item}`, 25, yPos, 165)
    yPos += 5
  })

  yPos += 10

  // Section 4
  doc.setFont('helvetica', 'bold')
  doc.text('4. DREPTURILE DUMNEAVOASTRĂ', 20, yPos)
  yPos += 10
  doc.setFont('helvetica', 'normal')

  const rights = [
    'Dreptul de acces la datele personale',
    'Dreptul de rectificare',
    'Dreptul la ștergerea datelor ("dreptul de a fi uitat")',
    'Dreptul la restricționarea prelucrării',
    'Dreptul la portabilitatea datelor',
    'Dreptul de opoziție',
    'Dreptul de a depune o plângere la ANSPDCP'
  ]

  rights.forEach(item => {
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
    yPos = addWrappedText(doc, `• ${item}`, 25, yPos, 165)
    yPos += 5
  })

  yPos += 10

  // Section 5
  if (yPos > 240) {
    doc.addPage()
    yPos = 20
  }

  doc.setFont('helvetica', 'bold')
  doc.text('5. PĂSTRAREA DATELOR', 20, yPos)
  yPos += 10
  doc.setFont('helvetica', 'normal')

  const retention = `Datele dumneavoastră cu caracter personal vor fi păstrate doar atât timp cât este necesar pentru îndeplinirea scopurilor pentru care au fost colectate sau conform obligațiilor legale aplicabile (de exemplu, termenele de păstrare fiscale de 10 ani).`
  
  yPos = addWrappedText(doc, retention, 20, yPos, 170)
  yPos += 10

  // Section 6
  if (yPos > 240) {
    doc.addPage()
    yPos = 20
  }

  doc.setFont('helvetica', 'bold')
  doc.text('6. SECURITATEA DATELOR', 20, yPos)
  yPos += 10
  doc.setFont('helvetica', 'normal')

  const security = `Am implementat măsuri tehnice și organizatorice adecvate pentru a proteja datele dumneavoastră împotriva accesului neautorizat, modificării, divulgării sau distrugerii. Acestea includ criptarea datelor, controale de acces și monitorizare continuă.`
  
  yPos = addWrappedText(doc, security, 20, yPos, 170)
  yPos += 10

  // Section 7
  doc.setFont('helvetica', 'bold')
  doc.text('7. CONTACT', 20, yPos)
  yPos += 10
  doc.setFont('helvetica', 'normal')

  const contact = `Pentru orice întrebări legate de această Politică de Confidențialitate sau de exercitarea drepturilor dumneavoastră, ne puteți contacta la:`
  
  yPos = addWrappedText(doc, contact, 20, yPos, 170)
  yPos += 7

  if (companyData.company_email) {
    doc.text(`Email: ${companyData.company_email}`, 20, yPos)
    yPos += 7
  }

  if (companyData.company_phone) {
    doc.text(`Telefon: ${companyData.company_phone}`, 20, yPos)
    yPos += 7
  }

  if (companyData.company_address) {
    yPos = addWrappedText(doc, `Adresă: ${companyData.company_address}`, 20, yPos, 170)
  }

  // Footer
  yPos += 15
  doc.setFontSize(10)
  doc.text(`Document generat automat de ComplianceBot - ${format(new Date(), 'dd.MM.yyyy')}`, 105, 280, { align: 'center' })

  return doc
}

// ============================================
// Employment Contract (CIM)
// ============================================

export function generateEmploymentContract(
  companyData: CompanyData,
  employeeData: {
    name: string
    cnp: string
    address: string
    position: string
    salary: number
    start_date: string
  }
): jsPDF {
  const doc = new jsPDF()
  let yPos = 20

  // Title
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('CONTRACT INDIVIDUAL DE MUNCĂ', 105, yPos, { align: 'center' })
  
  yPos += 15
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')

  // Contract number and date
  doc.text(`Nr. ________ / ${format(new Date(), 'dd.MM.yyyy')}`, 20, yPos)
  yPos += 15

  // Parties
  doc.setFont('helvetica', 'bold')
  const parties = `Între ${companyData.company_name}, cu sediul în ${companyData.company_address || '___________'}, înregistrată la Registrul Comerțului sub nr. ${companyData.company_cui}, reprezentată legal de către _______________, în calitate de ANGAJATOR,`
  yPos = addWrappedText(doc, parties, 20, yPos, 170)
  
  yPos += 10
  const employee = `și ${employeeData.name}, domiciliat în ${employeeData.address}, identificat cu CNP ${employeeData.cnp}, în calitate de SALARIAT,`
  yPos = addWrappedText(doc, employee, 20, yPos, 170)

  yPos += 15

  // Article 1
  doc.setFont('helvetica', 'bold')
  doc.text('Art. 1 - OBIECTUL CONTRACTULUI', 20, yPos)
  yPos += 10
  doc.setFont('helvetica', 'normal')

  const art1 = `(1) Prin prezentul contract individual de muncă, salariatul se obligă să presteze munca convenită în folosul angajatorului, în funcția de ${employeeData.position}.`
  yPos = addWrappedText(doc, art1, 20, yPos, 170)
  yPos += 7

  const art1_2 = `(2) Salariatul se supune autorității angajatorului și regulamentului intern al societății.`
  yPos = addWrappedText(doc, art1_2, 20, yPos, 170)
  yPos += 15

  // Article 2
  doc.setFont('helvetica', 'bold')
  doc.text('Art. 2 - DURATA CONTRACTULUI', 20, yPos)
  yPos += 10
  doc.setFont('helvetica', 'normal')

  const art2 = `Prezentul contract se încheie pe durată nedeterminată, începând cu data de ${employeeData.start_date}.`
  yPos = addWrappedText(doc, art2, 20, yPos, 170)
  yPos += 15

  // Article 3
  if (yPos > 240) {
    doc.addPage()
    yPos = 20
  }

  doc.setFont('helvetica', 'bold')
  doc.text('Art. 3 - LOCUL DE MUNCĂ', 20, yPos)
  yPos += 10
  doc.setFont('helvetica', 'normal')

  const art3 = `Locul de muncă este sediul angajatorului din ${companyData.company_address || '___________'}.`
  yPos = addWrappedText(doc, art3, 20, yPos, 170)
  yPos += 15

  // Article 4
  doc.setFont('helvetica', 'bold')
  doc.text('Art. 4 - ATRIBUȚIILE POSTULUI', 20, yPos)
  yPos += 10
  doc.setFont('helvetica', 'normal')

  const art4 = `Atribuțiile specifice funcției ocupate de salariat sunt prevăzute în fișa postului, care face parte integrantă din prezentul contract.`
  yPos = addWrappedText(doc, art4, 20, yPos, 170)
  yPos += 15

  // Article 5
  doc.setFont('helvetica', 'bold')
  doc.text('Art. 5 - SALARIUL ȘI ALTE DREPTURI BĂNE STI', 20, yPos)
  yPos += 10
  doc.setFont('helvetica', 'normal')

  const art5 = `(1) Pentru munca prestată, salariatul beneficiază de un salariu de bază brut lunar în cuantum de ${employeeData.salary} RON.`
  yPos = addWrappedText(doc, art5, 20, yPos, 170)
  yPos += 7

  const art5_2 = `(2) Salariul se plătește lunar, până la data de 25 a lunii curente.`
  yPos = addWrappedText(doc, art5_2, 20, yPos, 170)
  yPos += 15

  // Article 6
  if (yPos > 240) {
    doc.addPage()
    yPos = 20
  }

  doc.setFont('helvetica', 'bold')
  doc.text('Art. 6 - TIMPUL DE MUNCĂ ȘI TIMPUL DE ODIHNĂ', 20, yPos)
  yPos += 10
  doc.setFont('helvetica', 'normal')

  const art6 = `(1) Durata normală a timpului de muncă este de 8 ore pe zi și 40 de ore pe săptămână.`
  yPos = addWrappedText(doc, art6, 20, yPos, 170)
  yPos += 7

  const art6_2 = `(2) Salariatul beneficiază de concediu de odihnă anual de 21 zile lucrătoare.`
  yPos = addWrappedText(doc, art6_2, 20, yPos, 170)
  yPos += 15

  // Signatures
  if (yPos > 220) {
    doc.addPage()
    yPos = 20
  }

  yPos += 20
  doc.text('ANGAJATOR,', 40, yPos)
  doc.text('SALARIAT,', 130, yPos)
  yPos += 7
  doc.text(companyData.company_name, 40, yPos)
  doc.text(employeeData.name, 130, yPos)

  // Footer
  doc.setFontSize(9)
  doc.text(`Document generat de ComplianceBot - ${format(new Date(), 'dd.MM.yyyy')}`, 105, 285, { align: 'center' })

  return doc
}

// ============================================
// Service Contract (Prestări Servicii)
// ============================================

export function generateServiceContract(
  companyData: CompanyData,
  clientData: {
    name: string
    cui: string
    address: string
  },
  serviceDetails: {
    description: string
    value: number
    payment_terms: string
  }
): jsPDF {
  const doc = new jsPDF()
  let yPos = 20

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('CONTRACT DE PRESTĂRI SERVICII', 105, yPos, { align: 'center' })
  
  yPos += 15
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')

  doc.text(`Nr. ________ / ${format(new Date(), 'dd.MM.yyyy')}`, 20, yPos)
  yPos += 15

  // Parties
  doc.setFont('helvetica', 'bold')
  const prestator = `Între ${companyData.company_name}, CUI ${companyData.company_cui}, cu sediul în ${companyData.company_address || '___________'}, în calitate de PRESTATOR,`
  yPos = addWrappedText(doc, prestator, 20, yPos, 170)
  
  yPos += 10
  const beneficiar = `și ${clientData.name}, CUI ${clientData.cui}, cu sediul în ${clientData.address}, în calitate de BENEFICIAR,`
  yPos = addWrappedText(doc, beneficiar, 20, yPos, 170)

  yPos += 15
  doc.setFont('helvetica', 'normal')
  doc.text('s-a încheiat prezentul contract:', 20, yPos)
  yPos += 15

  // Article 1
  doc.setFont('helvetica', 'bold')
  doc.text('Art. 1 - OBIECTUL CONTRACTULUI', 20, yPos)
  yPos += 10
  doc.setFont('helvetica', 'normal')

  yPos = addWrappedText(doc, serviceDetails.description, 20, yPos, 170)
  yPos += 15

  // Article 2
  doc.setFont('helvetica', 'bold')
  doc.text('Art. 2 - VALOAREA CONTRACTULUI', 20, yPos)
  yPos += 10
  doc.setFont('helvetica', 'normal')

  const value = `Valoarea totală a prezentului contract este de ${serviceDetails.value} RON + TVA.`
  yPos = addWrappedText(doc, value, 20, yPos, 170)
  yPos += 15

  // Article 3
  doc.setFont('helvetica', 'bold')
  doc.text('Art. 3 - TERMENE DE PLATĂ', 20, yPos)
  yPos += 10
  doc.setFont('helvetica', 'normal')

  yPos = addWrappedText(doc, serviceDetails.payment_terms, 20, yPos, 170)
  yPos += 20

  // Signatures
  if (yPos > 220) {
    doc.addPage()
    yPos = 20
  }

  doc.text('PRESTATOR,', 40, yPos)
  doc.text('BENEFICIAR,', 130, yPos)
  yPos += 7
  doc.text(companyData.company_name, 40, yPos)
  doc.text(clientData.name, 130, yPos)

  doc.setFontSize(9)
  doc.text(`Document generat de ComplianceBot - ${format(new Date(), 'dd.MM.yyyy')}`, 105, 285, { align: 'center' })

  return doc
}

// ============================================
// Export functions
// ============================================

export function downloadPDF(doc: jsPDF, filename: string) {
  doc.save(`${filename}.pdf`)
}

export function getPDFBlob(doc: jsPDF): Blob {
  return doc.output('blob')
}