"""
export_service.py — Excel / CSV / PDF export generation logic.
"""

import io
from typing import List, Any

# ---------------------------------------------------------------------------
# Excel export
# ---------------------------------------------------------------------------

def export_to_excel(headers: List[str], rows: List[List[Any]], sheet_name: str = "Sheet1") -> bytes:
    """
    Build an Excel workbook in memory and return raw bytes.

    Parameters
    ----------
    headers : column header labels
    rows    : list of row value lists (same order as headers)
    sheet_name : name of the single sheet

    Returns
    -------
    bytes  — ready to send as an HTTP response with
             Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    """
    try:
        import openpyxl
        from openpyxl.styles import Font, PatternFill, Alignment

        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = sheet_name

        # Header row — bold + light-blue background
        header_fill = PatternFill("solid", fgColor="4472C4")
        header_font = Font(bold=True, color="FFFFFF")
        for col_idx, header in enumerate(headers, start=1):
            cell = ws.cell(row=1, column=col_idx, value=header)
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = Alignment(horizontal="center")

        # Data rows
        for row_idx, row in enumerate(rows, start=2):
            for col_idx, value in enumerate(row, start=1):
                ws.cell(row=row_idx, column=col_idx, value=value)

        # Auto-fit column widths (approximate)
        for col_cells in ws.columns:
            max_len = max((len(str(c.value)) if c.value else 0) for c in col_cells)
            ws.column_dimensions[col_cells[0].column_letter].width = min(max_len + 4, 60)

        buffer = io.BytesIO()
        wb.save(buffer)
        return buffer.getvalue()

    except ImportError:
        raise RuntimeError("openpyxl is required for Excel export — run: pip install openpyxl")


# ---------------------------------------------------------------------------
# PDF export
# ---------------------------------------------------------------------------

def export_to_pdf(title: str, headers: List[str], rows: List[List[Any]]) -> bytes:
    """
    Build a PDF table in memory and return raw bytes.

    Returns
    -------
    bytes — ready to send as an HTTP response with Content-Type: application/pdf
    """
    try:
        from reportlab.lib.pagesizes import A4, landscape
        from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet
        from reportlab.lib import colors

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=landscape(A4))
        styles = getSampleStyleSheet()
        elements = []

        # Title
        elements.append(Paragraph(title, styles["Title"]))
        elements.append(Spacer(1, 12))

        # Table data
        table_data = [headers] + [[str(v) if v is not None else "" for v in row] for row in rows]
        table = Table(table_data, repeatRows=1)
        table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#4472C4")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 10),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#EBF0FA")]),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("FONTSIZE", (0, 1), (-1, -1), 9),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ])
        )
        elements.append(table)
        doc.build(elements)
        return buffer.getvalue()

    except ImportError:
        raise RuntimeError("reportlab is required for PDF export — run: pip install reportlab")


# ---------------------------------------------------------------------------
# CSV export (no extra dependency)
# ---------------------------------------------------------------------------

def export_to_csv(headers: List[str], rows: List[List[Any]]) -> str:
    """Return a CSV string (UTF-8)."""
    import csv

    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(headers)
    writer.writerows(rows)
    return buf.getvalue()
