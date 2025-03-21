import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Row, Col, Button } from 'react-bootstrap';

function LabForm({ labData }) {
  // Helper function to format dates from YYYYMMDD to individual components
  const formatDate = (dateString) => {
    if (!dateString || dateString.length !== 8) return { year: '', month: '', day: '' };
    return {
      year: dateString.substring(0, 4),
      month: dateString.substring(4, 6),
      day: dateString.substring(6, 8)
    };
  };


  // Extract data from jsonData if available
  const data = labData?.description || {};
  const serviceDate = formatDate(data['Service Date']);
  const dateOfBirth = formatDate(data['Date of Birth']);
  const signatureDate = data['Date'] ? data['Date'].split('/') : ['', '', ''];
  const otherTest1 = data['Other Tests']?.split('\n')[0] || '';
  const otherTest2 = data['Other Tests']?.split('\n')[1] || '';
  const otherTest3 = data['Other Tests']?.split('\n')[2] || '';

  console.log(labData);
  console.log(data["Biochemistry"]["ALT"]);

  return (
    <Form>
      {/* Requisitioning Clinician/Practitioner */}
      <Row className="mb-3">
        <Form.Group as={Col} controlId="Name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" defaultValue={data['Name'] || ''} />
        </Form.Group>

        <Form.Group as={Col} controlId="Address">
          <Form.Label>Address</Form.Label>
          <Form.Control type="text" defaultValue={data['Address'] || ''} />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="Clinician/Practitioner's Contact Number for Urgent Results">
          <Form.Label>Clinician/Practitioner's Contact Number for Urgent Results</Form.Label>
          <Form.Control type="text" defaultValue={data["Clinician/Practitioner's Contact Number for Urgent Results"] || ''} />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="Service Date">
          <Form.Label>Service Date</Form.Label>
          <Row>
            <Col>
              <Form.Control type="text" placeholder="yyyy" defaultValue={serviceDate.year} />
            </Col>
            <Col>
              <Form.Control type="text" placeholder="mm" defaultValue={serviceDate.month} />
            </Col>
            <Col>
              <Form.Control type="text" placeholder="dd" defaultValue={serviceDate.day} />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group as={Col} controlId="Clinician/Practitioner Number">
          <Form.Label>Clinician/Practitioner Number</Form.Label>
          <Form.Control type="text" defaultValue={data["Clinician/Practitioner Number"] || ''} />
        </Form.Group>

        <Form.Group as={Col} controlId="CPSO / Registration No.">
          <Form.Label>CPSO/Registration No.</Form.Label>
          <Form.Control type="text" defaultValue={data["CPSO / Registration No."] || ''} />
        </Form.Group>
      </Row>

      {/* Patient Information */}
      <Row className="mb-3">
        <Form.Group as={Col} controlId="Health Number">
          <Form.Label>Health Number</Form.Label>
          <Form.Control type="text" defaultValue={data["Health Number"] || ''} />
        </Form.Group>

        <Form.Group as={Col} md="4" controlId="Date of Birth">
          <Form.Label>Date of Birth</Form.Label>
          <Row>
            <Col>
              <Form.Control type="text" placeholder="yyyy" defaultValue={dateOfBirth.year} />
            </Col>
            <Col>
              <Form.Control type="text" placeholder="mm" defaultValue={dateOfBirth.month} />
            </Col>
            <Col>
              <Form.Control type="text" placeholder="dd" defaultValue={dateOfBirth.day} />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group as={Col} controlId="Sex">
          <Form.Label>Sex</Form.Label>
          <Form.Check inline label="M" name="Sex" type="radio" id="male" defaultChecked={data["Sex"] === "M"} />
          <Form.Check inline label="F" name="Sex" type="radio" id="female" defaultChecked={data["Sex"] === "F"} />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="Other Provincial Registration Number">
          <Form.Label>Province Other Provincial Registration Number</Form.Label>
          <Form.Control type="text" defaultValue={data["Other Provincial Registration Number"] || ''} />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="Patient's Telephone Contact Number">
          <Form.Label>Patient's Telephone Contact Number</Form.Label>
          <Form.Control type="text" defaultValue={data["Patient's Telephone Contact Number"] || ''} />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="OHIP/Insured">
          <Form.Check label="OHIP/Insured" type="checkbox" defaultChecked={data["Check one"]?.["OHIP/Insured"] === "YES"} />
        </Form.Group>

        <Form.Group as={Col} controlId="Third Party / Uninsured">
          <Form.Check label="Third Party/Uninsured" type="checkbox" defaultChecked={data["Check one"]?.["Third Party / Uninsured"] === "YES"} />
        </Form.Group>

        <Form.Group as={Col} controlId="WSIB">
          <Form.Check label="WSIB" type="checkbox" defaultChecked={data["Check one"]?.["WSIB"] === "YES"} />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="Additional Clinical Information">
          <Form.Label>Additional Clinical Information (e.g. diagnosis)</Form.Label>
          <Form.Control as="textarea" rows={3} defaultValue={data["Additional Clinical Information"] || ''} />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="Patient's Last Name (as per OHIP Card)">
          <Form.Label>Patient's Last Name (as per OHIP Card)</Form.Label>
          <Form.Control type="text" defaultValue={data["Patient's Last Name (as per OHIP Card)"] || ''} />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="Patient's First Name (as per OHIP Card)">
          <Form.Label>Patient's First & Middle Names (as per OHIP Card)</Form.Label>
          <Form.Control type="text" defaultValue={`${data["Patient's First Name (as per OHIP Card)"] || ''} ${data["Patient's Middle Name (as per OHIP Card)"] || ''}`} />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="Copy to: Clinician/Practitioner">
          <Form.Check label="Copy to: Clinician/Practitioner" type="checkbox" 
            defaultChecked={!!(data["Copy to: Clinician/Practitioner"]?.["Last Name"] || 
                              data["Copy to: Clinician/Practitioner"]?.["First Name"] || 
                              data["Copy to: Clinician/Practitioner"]?.["Address"])} />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="Patient's Address (including Postal Code)">
          <Form.Label>Patient's Address (including Postal Code)</Form.Label>
          <Form.Control type="text" defaultValue={data["Patient's Address (including Postal Code)"] || ''} />
        </Form.Group>
      </Row>

      {/* Test Selections */}
      <Row className="mb-3">
        <Col>
          <Form.Label>Biochemistry</Form.Label>
          <Form.Check label="Glucose - Random" id="Random" type="checkbox" defaultChecked={data["Biochemistry"]?.["Random"] === "YES"} />
          <Form.Check label="Glucose - Fasting" id="Fasting" type="checkbox" defaultChecked={data["Biochemistry"]?.["Fasting"] === "YES"} />
          <Form.Check label="HbA1C" id="HbA1C" type="checkbox" defaultChecked={data["Biochemistry"]?.["HbA1C"] === "YES"} />
          <Form.Check label="Creatinine (eGFR)" id="Creatinine (eGFR)" type="checkbox" defaultChecked={data["Biochemistry"]?.["Creatinine (eGFR)"] === "YES"} />
          <Form.Check label="Uric Acid" id="Uric Acid" type="checkbox" defaultChecked={data["Biochemistry"]?.["Uric Acid"] === "YES"} />
          <Form.Check label="Sodium" id="Sodium" type="checkbox" defaultChecked={data["Biochemistry"]?.["Sodium"] === "YES"} />
          <Form.Check label="Potassium" id="Potassium" type="checkbox" defaultChecked={data["Biochemistry"]?.["Potassium"] === "YES"} />
          <Form.Check label="ALT" id="ALT" type="checkbox" defaultChecked={data["Biochemistry"]?.["ALT"] === "YES"} />
          <Form.Check label="Alk. Phosphatase" id="Alk. Phosphatase" type="checkbox" defaultChecked={data["Biochemistry"]?.["Alk. Phosphatase"] === "YES"} />
          <Form.Check label="Bilirubin" id="Bilirubin" type="checkbox" defaultChecked={data["Biochemistry"]?.["Bilirubin"] === "YES"} />
          <Form.Check label="Albumin" id="Albumin" type="checkbox" defaultChecked={data["Biochemistry"]?.["Albumin"] === "YES"} />
          <Form.Check label="Lipid Assessment" id="Lipid Assessment" type="checkbox" defaultChecked={data["Biochemistry"]?.["Lipid Assessment"] === "YES"} />
          <Form.Check label="Albumin/Creatinine Ratio, Urine" id="Albumin / Creatinine Ratio, Urine" type="checkbox" defaultChecked={data["Biochemistry"]?.["Albumin / Creatinine Ratio, Urine"] === "YES"} />
          <Form.Check label="Urinalysis (Chemical)" id="Urinalysis (Chemical)" type="checkbox" defaultChecked={data["Biochemistry"]?.["Urinalysis (Chemical)"] === "YES"} />
          <Form.Check label="Vitamin D (25-Hydroxy)" id="Vitamin D (25-Hydroxy)" type="checkbox" defaultChecked={data["Vitamin D (25-Hydroxy)"]?.["Insured - Meets OHIP eligibility criteria"] === "YES" || data["Vitamin D (25-Hydroxy)"]?.["Uninsured - Patient responsible for payment"] === "YES"} />
        </Col>

        <Col>
          <Form.Label>Hematology</Form.Label>
          <Form.Check label="CBC" id="CBC" type="checkbox" defaultChecked={data["Hematology"]?.["CBC"] === 'YES'} />
          <Form.Check label="Prothrombin Time (INR)" id="Prothrombin Time (INR)" type="checkbox" defaultChecked={data["Hematology"]?.["Prothrombin Time (INR)"] === "YES"} />
        </Col>

        <Col>
          <Form.Label>Immunology</Form.Label>
          <Form.Check label="Immune Status/Previous Exposure - Specify:" id="Immune Status / Previous Exposure" type="checkbox" 
            defaultChecked={data["Viral Hepatitis"]?.["Immune Status / Previous Exposure"]?.["Hepatitis A"] === "YES" || 
                          data["Viral Hepatitis"]?.["Immune Status / Previous Exposure"]?.["Hepatitis B"] === "YES" || 
                          data["Viral Hepatitis"]?.["Immune Status / Previous Exposure"]?.["Hepatitis C"] === "YES"} />
          <Form.Control type="text" />
          <Form.Check label="Pregnancy Test (Urine)" id="Pregnancy Test (Urine)" type="checkbox" defaultChecked={data["Immunology"]?.["Pregnancy Test (Urine)"] === "YES"} />
          <Form.Check label="Mononucleosis Screen" id="Mononucleosis Screen" type="checkbox" defaultChecked={data["Immunology"]?.["Mononucleosis Screen"] === "YES"} />
          <Form.Check label="Rubella" id="Rubella" type="checkbox" defaultChecked={data["Immunology"]?.["Rubella"] === "YES"} />
          <Form.Check label="Prenatal: ABO, RhD, Antibody Screen (titre and ident. if positive)" id="Prenatal: ABO, RhD, Antibody Screen" type="checkbox" defaultChecked={data["Immunology"]?.["Prenatal: ABO, RhD, Antibody Screen"] === "YES"} />
          <Form.Check label="Repeat Prenatal Antibodies" id="Repeat Prenatal Antibodies" type="checkbox" defaultChecked={data["Immunology"]?.["Repeat Prenatal Antibodies"] === "YES"} />
          <Form.Check label="Prostate Specific Antigen (PSA)" id="Prostate Specific Antigen (PSA)" type="checkbox" 
            defaultChecked={data["Prostate Specific Antigen (PSA)"]?.["Total PSA"] === "YES" || 
                          data["Prostate Specific Antigen (PSA)"]?.["Free PSA"] === "YES"} />
          <Form.Check label="Total PSA" id="Total PSA" type="checkbox" defaultChecked={data["Prostate Specific Antigen (PSA)"]?.["Total PSA"] === "YES"} />
          <Form.Check label="Free PSA" id="Free PSA" type="checkbox" defaultChecked={data["Prostate Specific Antigen (PSA)"]?.["Free PSA"] === "YES"} />
        </Col>

        <Col>
          <Form.Label>Viral Hepatitis (check one only)</Form.Label>
          <Form.Check label="Acute Hepatitis" name="Viral Hepatitis" id="Acute Hepatitis" type="radio" defaultChecked={data["Viral Hepatitis"]?.["Acute Hepatitis"] === "YES"} />
          <Form.Check label="Chronic Hepatitis" name="Viral Hepatitis" id="Chronic Hepatitis" type="radio" defaultChecked={data["Viral Hepatitis"]?.["Chronic Hepatitis"] === "YES"} />
          <Form.Check label="Hepatitis A" name="Viral Hepatitis" id="Hepatitis A" type="radio" defaultChecked={data["Viral Hepatitis"]?.["Immune Status / Previous Exposure"]?.["Hepatitis A"] === "YES"} />
          <Form.Check label="Hepatitis B" name="Viral Hepatitis" id="Hepatitis B" type="radio" defaultChecked={data["Viral Hepatitis"]?.["Immune Status / Previous Exposure"]?.["Hepatitis B"] === "YES"} />
          <Form.Check label="Hepatitis C" name="Viral Hepatitis" id="Hepatitis C" type="radio" defaultChecked={data["Viral Hepatitis"]?.["Immune Status / Previous Exposure"]?.["Hepatitis C"] === "YES"} />
          <p>or order individual hepatitis tests in the "Other Tests" section below</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Label>Microbiology ID & Sensitivities (if warranted)</Form.Label>
          <Form.Check label="Insured-Meets OHIP eligibility criteria" id="Insured - Meets OHIP eligibility criteria" type="checkbox" 
            defaultChecked={data["Prostate Specific Antigen (PSA)"]?.["Insured - Meets OHIP eligibility criteria"] === "YES"} />
          <Form.Check label="Uninsured-Screening: Patient responsible for payment" id="Uninsured - Screening: Patient responsible for payment" type="checkbox" 
            defaultChecked={data["Prostate Specific Antigen (PSA)"]?.["Uninsured - Screening: Patient responsible for payment"] === "YES"} />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Label>Specify one below.</Form.Label>
          <Form.Check label="Cervical" id="Cervical" type="checkbox" defaultChecked={data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["Cervical"] === "YES"} />
          <Form.Check label="Vaginal" id="Vaginal" type="checkbox" defaultChecked={data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["Vaginal"] === "YES"} />
          <Form.Check label="Vaginal/Rectal - Group B Strep" id="Vaginal / Rectal - Group B Strep" type="checkbox" defaultChecked={data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["Vaginal / Rectal - Group B Strep"] === "YES"} />
          <Form.Check label="Chlamydia (specify source):" id="Chlamydia (specify source)" type="checkbox" defaultChecked={data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["Chlamydia (specify source)"] === "YES"} />
          <Form.Control type="text" />
          <Form.Check label="GC (specify source):" id="GC (specify source)" type="checkbox" defaultChecked={data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["GC (specify source)"] === "YES"} />
          <Form.Control type="text" />
          <Form.Check label="Sputum" id="Sputum" type="checkbox" defaultChecked={data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["Sputum"] === "YES"} />
          <Form.Check label="Throat" id="Throat" type="checkbox" defaultChecked={data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["Throat"] === "YES"} />
          <Form.Check label="Wound (specify source):" id="Wound (specify source)" type="checkbox" defaultChecked={data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["Wound (specify source)"] === "YES"} />
          <Form.Control type="text" />
          <Form.Check label="Urine" id="Urine" type="checkbox" defaultChecked={data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["Urine"] === "YES"} />
          <Form.Check label="Stool Culture" id="Stool Culture" type="checkbox" defaultChecked={data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["Stool Culture"] === "YES"} />
          <Form.Check label="Stool Ova & Parasites" id="Stool Ova & Parasites" type="checkbox" defaultChecked={data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["Stool Ova & Parasites"] === "YES"} />
          <Form.Check label="Other Swabs/Pus (specify source):" id="Other Swabs / Pus (specify source)" type="checkbox" defaultChecked={data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["Other Swabs / Pus (specify source)"] === "YES"} />
          <Form.Control type="text" />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Label>Neonatal Bilirubin:</Form.Label>
        </Col>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="3" controlId="Child's Age">
          <Form.Label>Child's Age:</Form.Label>
          <Form.Control type="text" placeholder="days" defaultValue={data["Child's Age"] || ''} />
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="childAgeHours">
          <Form.Label></Form.Label>
          <Form.Control type="text" placeholder="hours" />
        </Form.Group>
      </Row>

      <Row>
        <Col>
          <Form.Check label="Insured - Meets OHIP eligibility criteria:" id="Insured - Meets OHIP eligibility criteria" type="checkbox" 
            defaultChecked={data["Vitamin D (25-Hydroxy)"]?.["Insured - Meets OHIP eligibility criteria"] === "YES"} />
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Check label="osteopenia; osteoporosis; rickets; renal disease; malabsorption syndromes; medications affecting vitamin D metabolism" type="checkbox" />
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Check label="Uninsured-Patient responsible for payment" id="Uninsured - Patient responsible for payment" type="checkbox" 
            defaultChecked={data["Vitamin D (25-Hydroxy)"]?.["Uninsured - Patient responsible for payment"] === "YES"} />
        </Col>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="Clinician/Practitioner's tel. no.">
          <Form.Label>Clinician/Practitioner's tel. no.</Form.Label>
          <Form.Control type="text" defaultChecked={data["Biochemistry"]?.["Clinician/Practitioner's tel. no."] === "YES"} />
        </Form.Group>
        <Form.Group as={Col} controlId="Patient's 24 hr telephone no.">
          <Form.Label>Patient's 24 hr telephone no.</Form.Label>
          <Form.Control type="text" defaultChecked={data["Biochemistry"]?.["Patient's 24 hr telephone no."] === "YES"} />
        </Form.Group>
      </Row>

      {/* Other Tests */}
      <Row className="mb-3">
        <Col>
          <Form.Label>Other Tests (one test per line)</Form.Label>
          <Form.Control type="text" id="Other Tests1" defaultValue={otherTest1 || ''} />
          <Form.Control type="text" id="Other Tests2" defaultValue={otherTest2 || ''} />
          <Form.Control type="text" id="Other Tests3" defaultValue={otherTest3 || ''} />
          <Form.Control type="text" />
        </Col>
      </Row>

      {/* Therapeutic Drug Monitoring */}
      <Row className="mb-3">
        <Col>
          <Form.Label>Therapeutic Drug Monitoring:</Form.Label>
        </Col>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="Name of Drug #1">
          <Form.Label>Name of Drug #1</Form.Label>
          <Form.Control type="text" defaultValue={data["Biochemistry"]?.["Therapeutic Drug Monitoring"]?.["Name of Drug #1"] || ''} />
        </Form.Group>

        <Form.Group as={Col} controlId="Name of Drug #2">
          <Form.Label>Name of Drug #2</Form.Label>
          <Form.Control type="text" defaultValue={data["Biochemistry"]?.["Therapeutic Drug Monitoring"]?.["Name of Drug #2"] || ''} />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="Time Collected #1">
          <Form.Label>Time Collected #1</Form.Label>
          <Row>
            <Col>
              <Form.Control type="text" placeholder="hr" defaultValue={data["Biochemistry"]?.["Therapeutic Drug Monitoring"]?.["Time Collected #1"] || ''} />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group as={Col} md="4" controlId="Time Collected #2">
          <Form.Label>#2</Form.Label>
          <Row>
            <Col>
              <Form.Control type="text" placeholder="hr" defaultValue={data["Biochemistry"]?.["Therapeutic Drug Monitoring"]?.["Time Collected #2"] || ''} />
            </Col>
          </Row>
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="Time of Last Dose #1">
          <Form.Label>Time of Last Dose #1</Form.Label>
          <Row>
            <Col>
              <Form.Control type="text" placeholder="hr" defaultValue={data["Biochemistry"]?.["Therapeutic Drug Monitoring"]?.["Time of Last Dose #1"] || ''} />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group as={Col} md="4" controlId="Time of Last Dose #2">
          <Form.Label>#2</Form.Label>
          <Row>
            <Col>
              <Form.Control type="text" placeholder="hr" defaultValue={data["Biochemistry"]?.["Therapeutic Drug Monitoring"]?.["Time of Last Dose #2"] || ''} />
            </Col>
          </Row>
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="Time of Next Dose #1">
          <Form.Label>Time of Next Dose #1</Form.Label>
          <Row>
            <Col>
              <Form.Control type="text" placeholder="hr" defaultValue={data["Biochemistry"]?.["Therapeutic Drug Monitoring"]?.["Time of Next Dose #1"] || ''} />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group as={Col} md="4" controlId="Time of Next Dose #2">
          <Form.Label>#2</Form.Label>
          <Row>
            <Col>
              <Form.Control type="text" placeholder="hr" defaultValue={data["Biochemistry"]?.["Therapeutic Drug Monitoring"]?.["Time of Next Dose #2"] || ''} />
            </Col>
          </Row>
        </Form.Group>
      </Row>

      {/* Certification */}
      <Row className="mb-3">
        <Form.Group as={Col} controlId="I hereby certify the tests ordered are not for registered in or out patients of a hospital">
          <Form.Check 
            label="I hereby certify the tests ordered are not for registered in or out patients of a hospital." 
            type="checkbox" 
            defaultChecked={data["I hereby certify the tests ordered are not for registered in or out patients of a hospital"] === "YES"} 
          />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="Clinician/Practitioner Signature">
          <Form.Label>Clinician/Practitioner Signature</Form.Label>
          <Form.Control type="text" defaultChecked={data["Clinician/Practitioner Signature"] === "YES"} />
        </Form.Group>

        <Form.Group as={Col} md="4" controlId="Date">
          <Form.Label>Date</Form.Label>
          <Row>
            <Col>
              <Form.Control type="text" placeholder="yyyy" defaultValue={signatureDate[0] || ''} />
            </Col>
            <Col>
              <Form.Control type="text" placeholder="mm" defaultValue={signatureDate[1] || ''} />
            </Col>
            <Col>
              <Form.Control type="text" placeholder="dd" defaultValue={signatureDate[2] || ''} />
            </Col>
          </Row>
        </Form.Group>
      </Row>
    </Form>
  );
}

export default LabForm;