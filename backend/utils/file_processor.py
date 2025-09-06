import os
import PyPDF2
import docx
from typing import List
import mimetypes

class FileProcessor:
    def __init__(self):
        self.supported_types = {
            'application/pdf': self._process_pdf,
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': self._process_docx,
            'text/plain': self._process_txt,
            'text/csv': self._process_csv
        }
    
    def is_supported_file(self, filename: str) -> bool:
        """Check if file type is supported"""
        mime_type, _ = mimetypes.guess_type(filename)
        return mime_type in self.supported_types
    
    async def process_file(self, file_path: str) -> str:
        """Process a file and extract text content"""
        try:
            mime_type, _ = mimetypes.guess_type(file_path)
            
            if mime_type not in self.supported_types:
                raise ValueError(f"Unsupported file type: {mime_type}")
            
            processor = self.supported_types[mime_type]
            content = await processor(file_path)
            
            return content.strip()
            
        except Exception as e:
            raise Exception(f"Error processing file {file_path}: {str(e)}")
    
    async def _process_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                
                for page_num in range(len(pdf_reader.pages)):
                    page = pdf_reader.pages[page_num]
                    text += page.extract_text() + "\n"
                
                return text
                
        except Exception as e:
            raise Exception(f"Error reading PDF: {str(e)}")
    
    async def _process_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            doc = docx.Document(file_path)
            text = ""
            
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            
            return text
            
        except Exception as e:
            raise Exception(f"Error reading DOCX: {str(e)}")
    
    async def _process_txt(self, file_path: str) -> str:
        """Read text from TXT file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
                
        except UnicodeDecodeError:
            # Try with different encoding
            try:
                with open(file_path, 'r', encoding='latin-1') as file:
                    return file.read()
            except Exception as e:
                raise Exception(f"Error reading text file: {str(e)}")
        except Exception as e:
            raise Exception(f"Error reading text file: {str(e)}")
    
    async def _process_csv(self, file_path: str) -> str:
        """Convert CSV to readable text format"""
        try:
            import pandas as pd
            df = pd.read_csv(file_path)
            
            # Convert DataFrame to readable text
            text = f"CSV Data with {len(df)} rows and {len(df.columns)} columns:\n\n"
            text += "Columns: " + ", ".join(df.columns.tolist()) + "\n\n"
            
            # Add first few rows as sample
            text += "Sample data:\n"
            text += df.head(10).to_string(index=False)
            
            return text
            
        except Exception as e:
            # Fallback to basic text reading
            return await self._process_txt(file_path)
    
    def get_file_info(self, file_path: str) -> dict:
        """Get file information"""
        try:
            stat = os.stat(file_path)
            mime_type, _ = mimetypes.guess_type(file_path)
            
            return {
                "filename": os.path.basename(file_path),
                "size": stat.st_size,
                "mime_type": mime_type,
                "modified": stat.st_mtime
            }
        except Exception as e:
            raise Exception(f"Error getting file info: {str(e)}")
