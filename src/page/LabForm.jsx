import {
  Box,
  Grid,
  TextField,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormGroup,
} from "@mui/material"

function LabForm({ labData }) {
  // Helper function to format dates from YYYYMMDD to individual components
  const formatDate = (dateString) => {
    if (!dateString || dateString.length !== 8) return { year: "", month: "", day: "" }
    return {
      year: dateString.substring(0, 4),
      month: dateString.substring(4, 6),
      day: dateString.substring(6, 8),
    }
  }

  // Extract data from jsonData if available
  const data = labData?.description || {}
  const serviceDate = formatDate(data["Service Date"])
  const dateOfBirth = formatDate(data["Date of Birth"])
  const signatureDate = data["Date"] ? data["Date"].split("/") : ["", "", ""]
  const otherTest1 = data["Other Tests"]?.split("\n")[0] || ""
  const otherTest2 = data["Other Tests"]?.split("\n")[1] || ""
  const otherTest3 = data["Other Tests"]?.split("\n")[2] || ""

  console.log(labData)
  console.log(data["Biochemistry"]?.["ALT"])

  return (
    <Box component="form">
      {/* Requisitioning Clinician/Practitioner */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" component="label" htmlFor="Name" gutterBottom>
            Name
          </Typography>
          <TextField fullWidth id="Name" defaultValue={data["Name"] || ""} variant="outlined" />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" component="label" htmlFor="Address" gutterBottom>
            Address
          </Typography>
          <TextField fullWidth id="Address" defaultValue={data["Address"] || ""} variant="outlined" />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12}>
          <Typography variant="body1" component="label" htmlFor="ContactNumber" gutterBottom>
            Clinician/Practitioner's Contact Number for Urgent Results
          </Typography>
          <TextField
            fullWidth
            id="ContactNumber"
            defaultValue={data["Clinician/Practitioner's Contact Number for Urgent Results"] || ""}
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="body1" component="label" gutterBottom>
            Service Date
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <TextField fullWidth placeholder="yyyy" defaultValue={serviceDate.year} variant="outlined" />
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth placeholder="mm" defaultValue={serviceDate.month} variant="outlined" />
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth placeholder="dd" defaultValue={serviceDate.day} variant="outlined" />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="body1" component="label" htmlFor="ClinicianNumber" gutterBottom>
            Clinician/Practitioner Number
          </Typography>
          <TextField
            fullWidth
            id="ClinicianNumber"
            defaultValue={data["Clinician/Practitioner Number"] || ""}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="body1" component="label" htmlFor="CPSO" gutterBottom>
            CPSO/Registration No.
          </Typography>
          <TextField fullWidth id="CPSO" defaultValue={data["CPSO / Registration No."] || ""} variant="outlined" />
        </Grid>
      </Grid>

      {/* Patient Information */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="body1" component="label" htmlFor="HealthNumber" gutterBottom>
            Health Number
          </Typography>
          <TextField fullWidth id="HealthNumber" defaultValue={data["Health Number"] || ""} variant="outlined" />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="body1" component="label" gutterBottom>
            Date of Birth
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <TextField fullWidth placeholder="yyyy" defaultValue={dateOfBirth.year} variant="outlined" />
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth placeholder="mm" defaultValue={dateOfBirth.month} variant="outlined" />
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth placeholder="dd" defaultValue={dateOfBirth.day} variant="outlined" />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="body1" component="label" gutterBottom>
            Sex
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup row name="Sex" defaultValue={data["Sex"] || ""}>
              <FormControlLabel value="M" control={<Radio />} label="M" />
              <FormControlLabel value="F" control={<Radio />} label="F" />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12}>
          <Typography variant="body1" component="label" htmlFor="OtherProvincialNumber" gutterBottom>
            Province Other Provincial Registration Number
          </Typography>
          <TextField
            fullWidth
            id="OtherProvincialNumber"
            defaultValue={data["Other Provincial Registration Number"] || ""}
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12}>
          <Typography variant="body1" component="label" htmlFor="PatientTelephone" gutterBottom>
            Patient's Telephone Contact Number
          </Typography>
          <TextField
            fullWidth
            id="PatientTelephone"
            defaultValue={data["Patient's Telephone Contact Number"] || ""}
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={4}>
          <FormControlLabel
            control={<Checkbox defaultChecked={data["Check one"]?.["OHIP/Insured"] === "YES"} />}
            label="OHIP/Insured"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControlLabel
            control={<Checkbox defaultChecked={data["Check one"]?.["Third Party / Uninsured"] === "YES"} />}
            label="Third Party/Uninsured"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControlLabel
            control={<Checkbox defaultChecked={data["Check one"]?.["WSIB"] === "YES"} />}
            label="WSIB"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12}>
          <Typography variant="body1" component="label" htmlFor="AdditionalInfo" gutterBottom>
            Additional Clinical Information (e.g. diagnosis)
          </Typography>
          <TextField
            fullWidth
            id="AdditionalInfo"
            multiline
            rows={3}
            defaultValue={data["Additional Clinical Information"] || ""}
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12}>
          <Typography variant="body1" component="label" htmlFor="PatientLastName" gutterBottom>
            Patient's Last Name (as per OHIP Card)
          </Typography>
          <TextField
            fullWidth
            id="PatientLastName"
            defaultValue={data["Patient's Last Name (as per OHIP Card)"] || ""}
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12}>
          <Typography variant="body1" component="label" htmlFor="PatientFirstName" gutterBottom>
            Patient's First & Middle Names (as per OHIP Card)
          </Typography>
          <TextField
            fullWidth
            id="PatientFirstName"
            defaultValue={`${data["Patient's First Name (as per OHIP Card)"] || ""} ${data["Patient's Middle Name (as per OHIP Card)"] || ""}`}
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked={
                  !!(
                    data["Copy to: Clinician/Practitioner"]?.["Last Name"] ||
                    data["Copy to: Clinician/Practitioner"]?.["First Name"] ||
                    data["Copy to: Clinician/Practitioner"]?.["Address"]
                  )
                }
              />
            }
            label="Copy to: Clinician/Practitioner"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12}>
          <Typography variant="body1" component="label" htmlFor="PatientAddress" gutterBottom>
            Patient's Address (including Postal Code)
          </Typography>
          <TextField
            fullWidth
            id="PatientAddress"
            defaultValue={data["Patient's Address (including Postal Code)"] || ""}
            variant="outlined"
          />
        </Grid>
      </Grid>

      {/* Test Selections */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Typography variant="body1" fontWeight="medium" gutterBottom>
            Biochemistry
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked={data["Biochemistry"]?.["Random"] === "YES"} />}
              label="Glucose - Random"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked={data["Biochemistry"]?.["Fasting"] === "YES"} />}
              label="Glucose - Fasting"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked={data["Biochemistry"]?.["HbA1C"] === "YES"} />}
              label="HbA1C"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked={data["Biochemistry"]?.["Creatinine (eGFR)"] === "YES"} />}
              label="Creatinine (eGFR)"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked={data["Biochemistry"]?.["Uric Acid"] === "YES"} />}
              label="Uric Acid"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked={data["Biochemistry"]?.["Sodium"] === "YES"} />}
              label="Sodium"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked={data["Biochemistry"]?.["Potassium"] === "YES"} />}
              label="Potassium"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked={data["Biochemistry"]?.["ALT"] === "YES"} />}
              label="ALT"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked={data["Biochemistry"]?.["Alk. Phosphatase"] === "YES"} />}
              label="Alk. Phosphatase"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked={data["Biochemistry"]?.["Bilirubin"] === "YES"} />}
              label="Bilirubin"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked={data["Biochemistry"]?.["Albumin"] === "YES"} />}
              label="Albumin"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked={data["Biochemistry"]?.["Lipid Assessment"] === "YES"} />}
              label="Lipid Assessment"
            />
            <FormControlLabel
              control={
                <Checkbox defaultChecked={data["Biochemistry"]?.["Albumin / Creatinine Ratio, Urine"] === "YES"} />
              }
              label="Albumin/Creatinine Ratio, Urine"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked={data["Biochemistry"]?.["Urinalysis (Chemical)"] === "YES"} />}
              label="Urinalysis (Chemical)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={
                    data["Vitamin D (25-Hydroxy)"]?.["Insured - Meets OHIP eligibility criteria"] === "YES" ||
                    data["Vitamin D (25-Hydroxy)"]?.["Uninsured - Patient responsible for payment"] === "YES"
                  }
                />
              }
              label="Vitamin D (25-Hydroxy)"
            />
          </FormGroup>
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography variant="body1" fontWeight="medium" gutterBottom>
            Hematology
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked={data["Hematology"]?.["CBC"] === "YES"} />}
              label="CBC"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked={data["Hematology"]?.["Prothrombin Time (INR)"] === "YES"} />}
              label="Prothrombin Time (INR)"
            />
          </FormGroup>
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography variant="body1" fontWeight="medium" gutterBottom>
            Immunology
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={
                    data["Viral Hepatitis"]?.["Immune Status / Previous Exposure"]?.["Hepatitis A"] === "YES" ||
                    data["Viral Hepatitis"]?.["Immune Status / Previous Exposure"]?.["Hepatitis B"] === "YES" ||
                    data["Viral Hepatitis"]?.["Immune Status / Previous Exposure"]?.["Hepatitis C"] === "YES"
                  }
                />
              }
              label="Immune Status/Previous Exposure - Specify:"
            />
            <TextField fullWidth variant="outlined" sx={{ mb: 2 }} />
            <FormControlLabel
              control={<Checkbox defaultChecked={data["Immunology"]?.["Pregnancy Test (Urine)"] === "YES"} />}
              label="Pregnancy Test (Urine)"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked={data["Immunology"]?.["Mononucleosis Screen"] === "YES"} />}
              label="Mononucleosis Screen"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked={data["Immunology"]?.["Rubella"] === "YES"} />}
              label="Rubella"
            />
            <FormControlLabel
              control={
                <Checkbox defaultChecked={data["Immunology"]?.["Prenatal: ABO, RhD, Antibody Screen"] === "YES"} />
              }
              label="Prenatal: ABO, RhD, Antibody Screen (titre and ident. if positive)"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked={data["Immunology"]?.["Repeat Prenatal Antibodies"] === "YES"} />}
              label="Repeat Prenatal Antibodies"
            />
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={
                    data["Prostate Specific Antigen (PSA)"]?.["Total PSA"] === "YES" ||
                    data["Prostate Specific Antigen (PSA)"]?.["Free PSA"] === "YES"
                  }
                />
              }
              label="Prostate Specific Antigen (PSA)"
            />
            <FormControlLabel
              control={<Checkbox defaultChecked={data["Prostate Specific Antigen (PSA)"]?.["Total PSA"] === "YES"} />}
              label="Total PSA"
              sx={{ ml: 3 }}
            />
            <FormControlLabel
              control={<Checkbox defaultChecked={data["Prostate Specific Antigen (PSA)"]?.["Free PSA"] === "YES"} />}
              label="Free PSA"
              sx={{ ml: 3 }}
            />
          </FormGroup>
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography variant="body1" fontWeight="medium" gutterBottom>
            Viral Hepatitis (check one only)
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup name="ViralHepatitis">
              <FormControlLabel
                value="Acute Hepatitis"
                control={<Radio defaultChecked={data["Viral Hepatitis"]?.["Acute Hepatitis"] === "YES"} />}
                label="Acute Hepatitis"
              />
              <FormControlLabel
                value="Chronic Hepatitis"
                control={<Radio defaultChecked={data["Viral Hepatitis"]?.["Chronic Hepatitis"] === "YES"} />}
                label="Chronic Hepatitis"
              />
              <FormControlLabel
                value="Hepatitis A"
                control={
                  <Radio
                    defaultChecked={
                      data["Viral Hepatitis"]?.["Immune Status / Previous Exposure"]?.["Hepatitis A"] === "YES"
                    }
                  />
                }
                label="Hepatitis A"
              />
              <FormControlLabel
                value="Hepatitis B"
                control={
                  <Radio
                    defaultChecked={
                      data["Viral Hepatitis"]?.["Immune Status / Previous Exposure"]?.["Hepatitis B"] === "YES"
                    }
                  />
                }
                label="Hepatitis B"
              />
              <FormControlLabel
                value="Hepatitis C"
                control={
                  <Radio
                    defaultChecked={
                      data["Viral Hepatitis"]?.["Immune Status / Previous Exposure"]?.["Hepatitis C"] === "YES"
                    }
                  />
                }
                label="Hepatitis C"
              />
            </RadioGroup>
          </FormControl>
          <Typography variant="body2" color="text.secondary" mt={1}>
            or order individual hepatitis tests in the "Other Tests" section below
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12}>
          <Typography variant="body1" fontWeight="medium" gutterBottom>
            Microbiology ID & Sensitivities (if warranted)
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={
                    data["Prostate Specific Antigen (PSA)"]?.["Insured - Meets OHIP eligibility criteria"] === "YES"
                  }
                />
              }
              label="Insured-Meets OHIP eligibility criteria"
            />
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={
                    data["Prostate Specific Antigen (PSA)"]?.[
                      "Uninsured - Screening: Patient responsible for payment"
                    ] === "YES"
                  }
                />
              }
              label="Uninsured-Screening: Patient responsible for payment"
            />
          </FormGroup>
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12}>
          <Typography variant="body1" gutterBottom>
            Specify one below.
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["Cervical"] === "YES"}
                />
              }
              label="Cervical"
            />
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["Vaginal"] === "YES"}
                />
              }
              label="Vaginal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={
                    data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["Vaginal / Rectal - Group B Strep"] ===
                    "YES"
                  }
                />
              }
              label="Vaginal/Rectal - Group B Strep"
            />
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={
                    data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["Chlamydia (specify source)"] === "YES"
                  }
                />
              }
              label="Chlamydia (specify source):"
            />
            <TextField fullWidth variant="outlined" sx={{ mb: 2 }} />
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={
                    data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["GC (specify source)"] === "YES"
                  }
                />
              }
              label="GC (specify source):"
            />
            <TextField fullWidth variant="outlined" sx={{ mb: 2 }} />
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["Sputum"] === "YES"}
                />
              }
              label="Sputum"
            />
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["Throat"] === "YES"}
                />
              }
              label="Throat"
            />
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={
                    data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["Wound (specify source)"] === "YES"
                  }
                />
              }
              label="Wound (specify source):"
            />
            <TextField fullWidth variant="outlined" sx={{ mb: 2 }} />
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["Urine"] === "YES"}
                />
              }
              label="Urine"
            />
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["Stool Culture"] === "YES"}
                />
              }
              label="Stool Culture"
            />
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={
                    data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["Stool Ova & Parasites"] === "YES"
                  }
                />
              }
              label="Stool Ova & Parasites"
            />
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={
                    data["Immunology"]?.["Microbiology ID & Sensitivities"]?.["Other Swabs / Pus (specify source)"] ===
                    "YES"
                  }
                />
              }
              label="Other Swabs/Pus (specify source):"
            />
            <TextField fullWidth variant="outlined" sx={{ mb: 2 }} />
          </FormGroup>
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12}>
          <Typography variant="body1" fontWeight="medium" gutterBottom>
            Neonatal Bilirubin:
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={3}>
          <Typography variant="body1" component="label" htmlFor="ChildAge" gutterBottom>
            Child's Age:
          </Typography>
          <TextField
            fullWidth
            id="ChildAge"
            placeholder="days"
            defaultValue={data["Child's Age"] || ""}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography variant="body1" component="label" htmlFor="ChildAgeHours" gutterBottom>
            &nbsp;
          </Typography>
          <TextField fullWidth id="ChildAgeHours" placeholder="hours" variant="outlined" />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={1}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked={data["Vitamin D (25-Hydroxy)"]?.["Insured - Meets OHIP eligibility criteria"] === "YES"}
              />
            }
            label="Insured - Meets OHIP eligibility criteria:"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={1}>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox />}
            label="osteopenia; osteoporosis; rickets; renal disease; malabsorption syndromes; medications affecting vitamin D metabolism"
            sx={{ ml: 3 }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked={
                  data["Vitamin D (25-Hydroxy)"]?.["Uninsured - Patient responsible for payment"] === "YES"
                }
              />
            }
            label="Uninsured-Patient responsible for payment"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" component="label" htmlFor="ClinicianTel" gutterBottom>
            Clinician/Practitioner's tel. no.
          </Typography>
          <TextField
            fullWidth
            id="ClinicianTel"
            defaultValue={data["Biochemistry"]?.["Clinician/Practitioner's tel. no."] || ""}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" component="label" htmlFor="Patient24hrTel" gutterBottom>
            Patient's 24 hr telephone no.
          </Typography>
          <TextField
            fullWidth
            id="Patient24hrTel"
            defaultValue={data["Biochemistry"]?.["Patient's 24 hr telephone no."] || ""}
            variant="outlined"
          />
        </Grid>
      </Grid>

      {/* Other Tests */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12}>
          <Typography variant="body1" fontWeight="medium" gutterBottom>
            Other Tests (one test per line)
          </Typography>
          <TextField fullWidth id="OtherTests1" defaultValue={otherTest1 || ""} variant="outlined" sx={{ mb: 1 }} />
          <TextField fullWidth id="OtherTests2" defaultValue={otherTest2 || ""} variant="outlined" sx={{ mb: 1 }} />
          <TextField fullWidth id="OtherTests3" defaultValue={otherTest3 || ""} variant="outlined" sx={{ mb: 1 }} />
          <TextField fullWidth variant="outlined" />
        </Grid>
      </Grid>

      {/* Therapeutic Drug Monitoring */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12}>
          <Typography variant="body1" fontWeight="medium" gutterBottom>
            Therapeutic Drug Monitoring:
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" component="label" htmlFor="DrugName1" gutterBottom>
            Name of Drug #1
          </Typography>
          <TextField
            fullWidth
            id="DrugName1"
            defaultValue={data["Biochemistry"]?.["Therapeutic Drug Monitoring"]?.["Name of Drug #1"] || ""}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" component="label" htmlFor="DrugName2" gutterBottom>
            Name of Drug #2
          </Typography>
          <TextField
            fullWidth
            id="DrugName2"
            defaultValue={data["Biochemistry"]?.["Therapeutic Drug Monitoring"]?.["Name of Drug #2"] || ""}
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" component="label" htmlFor="TimeCollected1" gutterBottom>
            Time Collected #1
          </Typography>
          <TextField
            fullWidth
            id="TimeCollected1"
            placeholder="hr"
            defaultValue={data["Biochemistry"]?.["Therapeutic Drug Monitoring"]?.["Time Collected #1"] || ""}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" component="label" htmlFor="TimeCollected2" gutterBottom>
            #2
          </Typography>
          <TextField
            fullWidth
            id="TimeCollected2"
            placeholder="hr"
            defaultValue={data["Biochemistry"]?.["Therapeutic Drug Monitoring"]?.["Time Collected #2"] || ""}
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" component="label" htmlFor="LastDose1" gutterBottom>
            Time of Last Dose #1
          </Typography>
          <TextField
            fullWidth
            id="LastDose1"
            placeholder="hr"
            defaultValue={data["Biochemistry"]?.["Therapeutic Drug Monitoring"]?.["Time of Last Dose #1"] || ""}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" component="label" htmlFor="LastDose2" gutterBottom>
            #2
          </Typography>
          <TextField
            fullWidth
            id="LastDose2"
            placeholder="hr"
            defaultValue={data["Biochemistry"]?.["Therapeutic Drug Monitoring"]?.["Time of Last Dose #2"] || ""}
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" component="label" htmlFor="NextDose1" gutterBottom>
            Time of Next Dose #1
          </Typography>
          <TextField
            fullWidth
            id="NextDose1"
            placeholder="hr"
            defaultValue={data["Biochemistry"]?.["Therapeutic Drug Monitoring"]?.["Time of Next Dose #1"] || ""}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" component="label" htmlFor="NextDose2" gutterBottom>
            #2
          </Typography>
          <TextField
            fullWidth
            id="NextDose2"
            placeholder="hr"
            defaultValue={data["Biochemistry"]?.["Therapeutic Drug Monitoring"]?.["Time of Next Dose #2"] || ""}
            variant="outlined"
          />
        </Grid>
      </Grid>

      {/* Certification */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked={
                  data["I hereby certify the tests ordered are not for registered in or out patients of a hospital"] ===
                  "YES"
                }
              />
            }
            label="I hereby certify the tests ordered are not for registered in or out patients of a hospital."
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" component="label" htmlFor="Signature" gutterBottom>
            Clinician/Practitioner Signature
          </Typography>
          <TextField
            fullWidth
            id="Signature"
            defaultValue={data["Clinician/Practitioner Signature"] || ""}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" component="label" gutterBottom>
            Date
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <TextField fullWidth placeholder="yyyy" defaultValue={signatureDate[0] || ""} variant="outlined" />
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth placeholder="mm" defaultValue={signatureDate[1] || ""} variant="outlined" />
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth placeholder="dd" defaultValue={signatureDate[2] || ""} variant="outlined" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default LabForm

