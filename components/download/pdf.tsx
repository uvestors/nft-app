import React from "react";

export interface DownloadPDFProps extends BaseComponentProps {
  filename: string;
}

const DownloadPDF = ({ children, filename }: DownloadPDFProps) => {
  return (
    <a
      href={`https://rvi-download.111829.xyz/pdf/${filename}`}
      download={filename}
      target="_blank"
    >
      {children}
    </a>
  );
};

export default DownloadPDF;
