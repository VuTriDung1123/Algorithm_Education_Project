const fs = require('fs');

function copyAndReplace(srcPrefix, destPrefix, titleOld, titleNew, functionPrefixOld, functionPrefixNew) {
    const codeSrc = `src/lib/data-structures/${srcPrefix}Code.ts`;
    const logicSrc = `src/lib/data-structures/${srcPrefix}Logic.ts`;
    
    const codeDest = `src/lib/data-structures/${destPrefix}Code.ts`;
    const logicDest = `src/lib/data-structures/${destPrefix}Logic.ts`;
    
    let destRoute = destPrefix.replace(/([A-Z])/g, "-$1").toLowerCase();
    const pageDestDir = `src/app/data-structures/${destRoute}`;
    const pageDest = `${pageDestDir}/page.tsx`;
    
    if (!fs.existsSync(pageDestDir)) fs.mkdirSync(pageDestDir, { recursive: true });
    
    // Code
    let codeContent = fs.readFileSync(codeSrc, 'utf8');
    codeContent = codeContent.replace(new RegExp(functionPrefixOld, 'g'), functionPrefixNew);
    codeContent = codeContent.replace(new RegExp(functionPrefixOld.toUpperCase(), 'g'), functionPrefixNew.toUpperCase());
    if (destPrefix === 'maxHeap' || destPrefix === 'pq') {
        codeContent = codeContent.replace(/current < minHeap\[parent\]/g, "current > maxHeap[parent]");
        codeContent = codeContent.replace(/minHeap\[smallest\]/g, "maxHeap[largest]");
        codeContent = codeContent.replace(/smallest/g, "largest");
        codeContent = codeContent.replace(/minHeap/g, "maxHeap");
        codeContent = codeContent.replace(/MIN_HEAP/g, "MAX_HEAP");
    }
    fs.writeFileSync(codeDest, codeContent);
    
    // Logic
    let logicContent = fs.readFileSync(logicSrc, 'utf8');
    logicContent = logicContent.replace(new RegExp(functionPrefixOld, 'g'), functionPrefixNew);
    logicContent = logicContent.replace(new RegExp(srcPrefix, 'g'), destPrefix);
    if (destPrefix === 'maxHeap' || destPrefix === 'pq') {
        logicContent = logicContent.replace(/< currentMainArr\[parentIdx\]/g, "> currentMainArr[parentIdx]");
        logicContent = logicContent.replace(/smallest/g, "largest");
        logicContent = logicContent.replace(/< currentMainArr\[largest\]/g, "> currentMainArr[largest]");
    }
    fs.writeFileSync(logicDest, logicContent);
    
    // Page
    let oldRoute = srcPrefix;
    if (srcPrefix === 'heap') oldRoute = 'min-heap';
    if (srcPrefix === 'hashTable') oldRoute = 'hash-table';
    let oldPageSrc = `src/app/data-structures/${oldRoute}/page.tsx`;
    let pageContent = fs.readFileSync(oldPageSrc, 'utf8');
    pageContent = pageContent.replace(new RegExp(functionPrefixOld, 'g'), functionPrefixNew);
    pageContent = pageContent.replace(new RegExp(srcPrefix, 'g'), destPrefix);
    pageContent = pageContent.replace(new RegExp(titleOld, 'g'), titleNew);
    if (destPrefix === 'maxHeap' || destPrefix === 'pq') {
        pageContent = pageContent.replace(/Min Heap/g, "Max Heap");
        pageContent = pageContent.replace(/Nhỏ Nhất/g, "Lớn Nhất");
    }
    fs.writeFileSync(pageDest, pageContent);
}

copyAndReplace('heap', 'maxHeap', 'Min Heap', 'Max Heap', 'minHeap', 'maxHeap');
copyAndReplace('heap', 'pq', 'Min Heap', 'Priority Queue', 'minHeap', 'pq');
copyAndReplace('hashTable', 'hashSet', 'Hash Table', 'Hash Set', 'hashTable', 'hashSet');
copyAndReplace('hashTable', 'hashMap', 'Hash Table', 'Hash Map', 'hashTable', 'hashMap');
copyAndReplace('hashTable', 'bloomFilter', 'Hash Table', 'Bloom Filter', 'hashTable', 'bloomFilter');
