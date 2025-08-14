
'use server';

import { PDFDocument, PDFTextField, PDFCheckBox, PDFRadioGroup, PDFDropdown, PDFOptionList, PDFButton, PDFSignature } from 'pdf-lib';

type FieldType = 'text' | 'checkbox' | 'radio' | 'dropdown' | 'listbox' | 'button' | 'signature' | 'unknown';

export interface FormFieldInfo {
  name: string;
  type: FieldType;
  options?: string[];
}

interface InspectState {
  fields?: FormFieldInfo[];
  error?: string;
  pdfDataUri?: string;
}

export async function inspectPdfForm(prevState: any, formData: FormData): Promise<InspectState> {
  const file = formData.get("pdf") as File;
  if (!file || file.type !== 'application/pdf') {
    return { error: "Please select a valid PDF file." };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    const fieldInfo: FormFieldInfo[] = fields.map(field => {
      const name = field.getName();
      let type: FieldType = 'unknown';
      let options: string[] | undefined;

      if (field instanceof PDFTextField) type = 'text';
      else if (field instanceof PDFCheckBox) type = 'checkbox';
      else if (field instanceof PDFRadioGroup) {
          type = 'radio';
          options = field.getOptions();
      }
      else if (field instanceof PDFDropdown) {
          type = 'dropdown';
          options = field.getOptions();
      }
       else if (field instanceof PDFOptionList) {
          type = 'listbox';
          options = field.getOptions();
      }
       else if (field instanceof PDFButton) type = 'button';
       else if (field instanceof PDFSignature) type = 'signature';
      
      return { name, type, options };
    });

    const pdfDataUri = `data:application/pdf;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
    return { fields: fieldInfo, pdfDataUri };

  } catch (err: any) {
    return { error: `Failed to inspect PDF: ${err.message}` };
  }
}


interface FillState {
    filledPdfDataUri?: string;
    error?: string;
}

export async function fillPdfForm(prevState: any, formData: FormData): Promise<FillState> {
    const pdfDataUri = formData.get('pdfDataUri') as string;
    if (!pdfDataUri) {
        return { error: 'Original PDF data is missing.' };
    }

    try {
        const existingPdfBytes = await fetch(pdfDataUri).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const form = pdfDoc.getForm();

        for (const [key, value] of formData.entries()) {
            if (key === 'pdfDataUri' || typeof value !== 'string') continue;

            const field = form.getField(key);
            if (field instanceof PDFTextField) {
                field.setText(value);
            } else if (field instanceof PDFCheckBox) {
                if(value === 'on') field.check();
                else field.uncheck();
            } else if (field instanceof PDFRadioGroup) {
                field.select(value);
            } else if (field instanceof PDFDropdown) {
                field.select(value);
            } else if (field instanceof PDFOptionList) {
                // This assumes single selection for simplicity. Multi-select would need an array.
                field.select(value);
            }
        }

        const pdfBytes = await pdfDoc.save();
        return {
            filledPdfDataUri: `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`
        };

    } catch(err: any) {
        return { error: `Failed to fill PDF: ${err.message}` };
    }
}
