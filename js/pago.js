window.mostrarCompra = function (p) {
    const saved = p || JSON.parse(localStorage.getItem('ultimaCompra') || 'null');
    if (!saved) return;

    const items = saved.carrito || saved.items || [];
    const total = saved.total ?? items.reduce((s, it) => s + (Number(it.precio) || 0) * (Number(it.cantidad) || 0), 0);
    const ventaId = saved.ventaId || `local-${Date.now()}`;
    const fecha = saved.fecha || new Date().toLocaleString();

    const purchase = { ventaId, fecha, items, total };

    const modal = document.getElementById('purchase-modal');
    const body = document.getElementById('purchase-body');
    if (!modal || !body) {
        descargarPdf(purchase);
        return;
    }

    body.innerHTML = items.map(it => `
    <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;">
      <div>
        <div style="font-weight:600">${it.nombre}</div>
        <div style="font-size:12px;color:#555;">${it.cantidad} x ${Number(it.precio).toFixed(2)}</div>
      </div>
      <div style="font-weight:600">$${((Number(it.precio) || 0) * (Number(it.cantidad) || 0)).toFixed(2)}</div>
    </div>
  `).join('') + `<hr><div style="text-align:right;font-weight:700;margin-top:8px;">Total: $${Number(total).toFixed(2)}</div>`;

    modal.style.display = 'flex';

    const btnDownload = document.getElementById('download-pdf');
    const btnClose1 = document.getElementById('close-purchase');
    const btnClose2 = document.getElementById('close-purchase-2');

    if (btnClose1) btnClose1.onclick = () => modal.style.display = 'none';
    if (btnClose2) btnClose2.onclick = () => window.location.href="index.html";

    if (btnDownload) {
        btnDownload.onclick = () => descargarPdf(purchase);
    } else {
        descargarPdf(purchase);
    }
};

function descargarPdf(purchase) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(14);
    doc.text('Alambique 22 - Resumen de compra', 14, y); y += 10;
    doc.setFontSize(10);
    doc.text(`Orden: ${purchase.ventaId}`, 14, y); y += 8;
    doc.text(`Fecha: ${purchase.fecha}`, 14, y); y += 12;

    purchase.items.forEach(it => {
        doc.text(`${it.cantidad} x ${it.nombre}`, 14, y);
        doc.text(`$${((Number(it.precio) || 0) * (Number(it.cantidad) || 0)).toFixed(2)}`, 180, y, { align: 'right' });
        y += 8;
        if (y > 280) { doc.addPage(); y = 20; }
    });

    y += 8;
    doc.setFontSize(12);
    doc.text(`Total: $${Number(purchase.total).toFixed(2)}`, 180, y, { align: 'right' });

    doc.save(`orden_${purchase.ventaId}.pdf`);
}
