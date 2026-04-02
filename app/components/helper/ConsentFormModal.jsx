"use client";
import React, { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { usePersonalizationStore } from "@/app/stores/usePersonalizationStore";

const CONSENT_OPTIONS = [
  {
    id: "drugs",
    title: "DRUGS & MEDICATIONS",
    content:
      "I understand that antibiotics, analgesics & other medications can cause allergic like redness & swelling of tissue, pain, itch, vomiting &/or anaphylactic shock.",
  },
  {
    id: "changes",
    title: "CHANGES IN TREATMENT PLAN",
    content:
      "I understand that during treatment it may be necessary to change/add procedure because of conditions found while working on the teeth that were not discovered during examination. For example, root canal treatment therapy may be needed following routine restorative procedures. I give my permission to the dentist to make any/all changes and additions as necessary w/ my responsibility to pay all the cost agreed.",
  },
  {
    id: "radiograph",
    title: "RADIOGRAPH",
    content:
      "I understand that an x-ray shot may be necessary as part of diagnosis aid to come up with tentative diagnosis of my dental problem and to make a good treatment plan. But this will not give me 100% assurance for accuracy of the treatment since all dental treatments are subject to unpredictable complications that later in may lead to sudden change in treatment plan and subject to new charges.",
  },
  {
    id: "extraction",
    title: "EXTRACTION OF TEETH",
    content:
      "I understand that alternative to tooth removal (root canal) & I completely understand this alternative including their risk & benefits prior to authorizing the dentist to remove teeth & any other structures necessary for reasons above. I understand that removing teeth does not always remove all the infections, if present, & it may be necessary to have further treatment. I understand the risk involved in having teeth removed such as pain, swelling, spread of infection, dry socket, fractured jew, loss of feeling on the teeth, lips, tongue & surrounding tissue that can last for an indefinite period of time. I understand that I may need further treatment under a specialist if complications arise during or following treatment.",
  },
  {
    id: "crowns",
    title: "CROWNS & BRIDGES",
    content:
      "Preparing a tooth may irritate the nerve tissue in the center of the tooth, leaving the tooth extra sensitive to heat, cold & pressure. Treating such irritation may involve using special toothpastes, mouth rinses or root canal. I understand that sometimes it is not possible to match the color of natural teeth exactly with artificial teeth. I further understand that I may be wearing temporary crowns, which may come off easily & that I must be careful to ensure that they are kept on until the permanent crowns are delivered. I understand there will be additional charges for remakes due to my delaying of permanent cementation, & I realized that final opportunity to make changes in my new crown, bridges, or cap (including shape, fit, size, & color) will be before permanent cementation.",
  },
  {
    id: "endodontics",
    title: "ENDODONTICS (ROOT CANAL)",
    content:
      "I understand there is no guarantee that a root canal treatment will save a tooth & that complications can occur from the treatment & that occasionally root canal filling materials may extend through the tooth which does not necessarily affect the success of the treatment. I understand that endodontic files & drills are very fine Instruments & stresses vented in their manufacture & calcifications present in teeth can cause them to break during use. I understand that referral to endodontist for additional treatments may be necessary following any root canal treatment & I agree that I am responsible for any additional cost for treatment performed by the endodontist. I understand that a tooth may require removal despite all efforts to save it.",
  },
  {
    id: "periodontal",
    title: "PERIODONTAL DISEASE",
    content:
      "I understand that periodontal disease is a serious condition causing gum & bone inflammation &/or loss & that can lead to the loss of my teeth. I understand that alternative treatment plans to correct periodontal disease, including gum surgery tooth extractions with or without replacement. I understand that undertaking any dental procedures may have future adverse effect on my periodontal conditions.",
  },
  {
    id: "fillings",
    title: "FILLINGS",
    content:
      "I understand that care must be exercised in chewing on fillings, especially during the first 24 hours to avoid breakage. I understand that a more extensive filling or a crown may be required, as additional decay or fracture may become evident after initial excavation. I understand that significant sensitivity is a common, but usually temporary after-effect of a newly placed filling. I further understand that filling a tooth may irritate the nerve tissue creating sensitivity & treating such sensitivity could require root canal therapy or extractions.",
  },
  {
    id: "dentures",
    title: "DENTURES",
    content:
      "I understand that wearing dentures can be difficult. Sore spots, altered speech & difficulty in eating are common problems. Immediate dentures (placement of denture immediately after extractions) may be painful, Immediate dentures may require considerable adjusting & s",
  },
];

const ConsentSection = ({ title, content, initialsImage }) => (
  <div className="consent-section mb-4 pb-4 border-b border-gray-200">
    <h4 className="font-bold text-sm text-gray-800 tracking-wide mb-1 uppercase">
      {title}
    </h4>
    <p className="text-sm text-gray-600 leading-relaxed text-justify">
      {content}
    </p>
    <div className="initials flex items-end justify-end mt-2">
      <span className="text-xs font-semibold text-gray-500 mr-2 uppercase tracking-wider">
        Initials:
      </span>
      {initialsImage ? (
        <span className="w-16 h-8 border-b border-gray-400 text-center flex items-center justify-center">
          <img
            src={initialsImage}
            alt="Initial Signature"
            className="h-full object-contain"
          />
        </span>
      ) : (
        <span className="w-16 h-8 border-b border-gray-300 text-center flex items-center justify-center text-gray-300">
          _____________
        </span>
      )}
    </div>
  </div>
);

export default function ConsentFormModal({ patient, calculateAge, onClose }) {
  const contentRef = useRef(null);
  const [signatureImage, setSignatureImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Access Personalization Store
  const { personalization, fetchPersonalization } = usePersonalizationStore();

  useEffect(() => {
    fetchPersonalization();
  }, []);

  const [selectedTreatments, setSelectedTreatments] = useState(
    CONSENT_OPTIONS.map((opt) => opt.id),
  );

  const handleToggleTreatment = (id) => {
    setSelectedTreatments((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () =>
    setSelectedTreatments(CONSENT_OPTIONS.map((opt) => opt.id));
  const handleClearAll = () => setSelectedTreatments([]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1024 * 100) {
        toast.error("Image must be smaller than 100KB.");
        return;
      }
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatureImage(reader.result);
        setIsUploading(false);
        toast.success("Signature image uploaded successfully.");
      };
      reader.onerror = () => {
        setIsUploading(false);
        toast.error("Failed to read file.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = async () => {
    if (!signatureImage) {
      toast.error(
        "Please upload the patient's signature/initials image before generating the PDF.",
      );
      return;
    }
    if (selectedTreatments.length === 0) {
      toast.error("Please select at least one treatment for the consent form.");
      return;
    }

    setIsGenerating(true);
    toast.loading("Generating PDF...", { id: "pdf-toast" });

    try {
      const element = contentRef.current;
      const imgData = await toPng(element, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });

      const img = new Image();
      img.src = imgData;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const margin = 10;
      const pdfWidth = 210 - margin * 2;
      const pageHeight = 295;
      const imgHeight = (img.height * pdfWidth) / img.width;
      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, "PNG", margin, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight - margin * 2;

      const overlapMargin = -1;
      while (heightLeft >= 0) {
        pdf.addPage();
        position = position - pageHeight + overlapMargin;
        pdf.addImage(imgData, "PNG", margin, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(
        `ConsentForm_${patient.patientName}_${new Date().toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, "_")}.pdf`,
      );
      toast.success("PDF generated successfully!", { id: "pdf-toast" });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. See console for details.", {
        id: "pdf-toast",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const age = calculateAge(patient.birthdate);

  return (
    <div className="modal modal-open z-50">
      <div className="modal-box w-full sm:w-11/12 max-w-5xl rounded-2xl shadow-2xl p-0 max-h-[90vh] flex flex-col relative bg-white">
        {/* Header - No-Print */}
        <div className="bg-red-600 text-white px-6 py-4 sticky top-0 z-10 rounded-t-2xl flex justify-between items-center no-print shadow-md">
          <h2 className="text-xl font-bold">Informed Consent Form</h2>
          <div className="flex flex-col md:flex-row space-x-2 space-y-2 md:space-y-0">
            <label
              className={`btn btn-sm border-none bg-white text-red-600 hover:bg-gray-100 cursor-pointer ${isGenerating ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isUploading
                ? "Uploading..."
                : signatureImage
                  ? "Replace Signature"
                  : "Upload Signature"}
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading || isGenerating}
              />
            </label>
            <button
              onClick={handlePrint}
              disabled={
                !signatureImage ||
                isGenerating ||
                selectedTreatments.length === 0
              }
              className="btn btn-sm border-none bg-white text-red-600 hover:bg-gray-100"
            >
              {isGenerating ? "Saving..." : "Save as PDF"} 💾
            </button>
            <button
              onClick={onClose}
              className="btn btn-sm border-none bg-red-800 text-white hover:bg-red-900"
            >
              Close
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-100">
          {/* Treatment Selection Area - NO PRINT */}
          <div className="bg-white border-b border-gray-200 p-5 no-print mx-auto max-w-4xl mt-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                Select Applicable Treatments:
              </h3>
              <div className="space-x-4">
                <button
                  onClick={handleSelectAll}
                  className="text-xs font-semibold text-red-600"
                >
                  Select All
                </button>
                <button
                  onClick={handleClearAll}
                  className="text-xs font-semibold text-gray-500"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {CONSENT_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className="flex items-start space-x-2 cursor-pointer text-sm p-1"
                >
                  <input
                    type="checkbox"
                    checked={selectedTreatments.includes(option.id)}
                    onChange={() => handleToggleTreatment(option.id)}
                    className="checkbox checkbox-sm checkbox-error mt-0.5"
                  />
                  <span className="leading-tight text-gray-700 font-medium">
                    {option.title}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-10 flex justify-center">
            <div
              className="print-area bg-white shadow-xl px-12 py-12"
              ref={contentRef}
              style={{ width: "210mm", minHeight: "297mm", color: "black" }}
            >
              {/* --- DYNAMIC CLINIC HEADER --- */}
              <div className="clinic-header flex justify-between items-start border-b-2 border-red-700 pb-6 mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <img
                      src="/dentserve-logo.png"
                      alt="Clinic Logo"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML =
                          '<div class="text-xs text-gray-400 border p-2">LOGO</div>';
                      }}
                    />
                  </div>
                  <div>
                    {/* DYNAMIC BUSINESS NAME */}
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                      {personalization?.businessName || "SENOTO DENTAL CARE"}
                    </h1>
                    {/* DYNAMIC ADDRESS */}
                    <p className="text-xs text-gray-600 mt-1 font-medium">
                      {personalization?.address ||
                        "123 Smile Avenue, Dental City, 12345"}
                    </p>
                    {/* DYNAMIC EMAIL/CONTACT */}
                    <p className="text-xs text-gray-600 font-medium">
                      Email: {personalization?.email || "info@yourclinic.com"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-black text-red-600 tracking-tight">
                    INFORMED CONSENT
                  </h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">
                    Date: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* --- PATIENT INFO --- */}
              <div className="patient-info mb-8">
                <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-3">
                  Patient Details
                </h3>
                <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-[13px] border-t border-gray-100 pt-3">
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-400">Patient Name:</span>
                    <span className="font-bold">{patient.patientName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-400">Date of Birth:</span>
                    <span className="font-bold">
                      {new Date(patient.birthdate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-400">Age:</span>
                    <span className="font-bold">{age || "N/A"}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-400">Contact:</span>
                    <span className="font-bold">
                      {patient.contact || "09xxxxxxxxx"}
                    </span>
                  </div>
                  <div className="col-span-2 flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-400">Address:</span>
                    <span className="font-bold">
                      {patient.address || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Content */}
              <div className="space-y-4 mb-10">
                {CONSENT_OPTIONS.filter((opt) =>
                  selectedTreatments.includes(opt.id),
                ).map((option) => (
                  <ConsentSection
                    key={option.id}
                    title={option.title}
                    content={option.content}
                    initialsImage={signatureImage}
                  />
                ))}
              </div>

              {/* --- FOOTER --- */}
              <div className="consent-footer mt-12 p-6 bg-gray-50 border border-gray-200 rounded break-inside-avoid">
                <p className="text-sm text-gray-700 leading-relaxed font-medium mb-10 text-justify">
                  I certify that I have read and understood the conditions of
                  this Informed Consent Form, and all my questions have been
                  answered to my satisfaction. I voluntarily give consent to the
                  proposed treatment plan.
                </p>
                <div className="grid grid-cols-2 gap-20">
                  <div className="text-center">
                    <div className="h-16 border-b border-black flex items-end justify-center pb-1">
                      {signatureImage && (
                        <img
                          src={signatureImage}
                          alt="Sig"
                          className="h-full object-contain"
                        />
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase mt-2 block tracking-tighter">
                      Patient / Guardian Signature
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="h-16 border-b border-black flex items-end justify-center pb-2">
                      <span className="font-bold text-sm">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase mt-2 block tracking-tighter">
                      Date Signed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
