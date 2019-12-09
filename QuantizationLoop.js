
/**
 * @description 2的4次根号
 */
const ROOT_2_4 = 1.189207115002721;

/**
 * @description 频谱平坦度，用于计算量化步长初值
 */
function SFM(xr) {
    let temp1 = 0, temp2 = 0;
    let xrlen = 0;
    for(let i = 0; i < xr.length; i++) {
        if(xr[i] === 0) continue;
        let sqr = xr[i] * xr[i];
        temp1 += Math.log(sqr);
        temp2 += sqr;
        xrlen++;
    }
    if(temp2 === 0) return 1;
    temp1 /= xrlen;
    temp1 = Math.exp(temp1);
    temp2 /= xrlen;
    return (temp1 / temp2);
}

/**
 * @description 计算各个尺度因子频带的量化误差
 */
function CalculateQuantDistortion(xr, ix, quantStep, blockType) {
    let xfsf = new Array();
    let SFB = ScaleFactorBands[SAMPLE_RATE][blockType];
    for(let sbindex = 0; sbindex < SFB.length; sbindex++) {
        let sum = 0;
        for(let i = SFB[sbindex][0]; i <= SFB[sbindex][1]; i++) {
            let temp1 = (ix[i] === 0) ? Math.abs(xr[i]) : (Math.abs(xr[i]) - Math.pow(Math.abs(ix[i]), (4/3)) * Math.pow(ROOT_2_4, quantStep)); // NOTE 与标准原文的差异：给ix[i]加了绝对值
            sum += (temp1 * temp1 / (SFB[sbindex][1] - SFB[sbindex][0] + 1));
        }
        xfsf[sbindex] = sum;
    }
    return xfsf;
}

/**
 * @description 量化
 */
function Quantize(xr, quantStep) {
    return (xr === 0) ? 0 : (Math.round(Math.pow((Math.abs(xr) / Math.pow(ROOT_2_4, quantStep)), 0.75) - 0.0946));
}

/**
 * @description 计算序列中最后一个非零值的下标，用于确定零值区的起始点。如果序列全为0，则返回-1。
 */
function LastNzeroIndex(seq) {
    for(let i = seq.length - 1; i >= 0; i--) {
        if(Math.abs(seq[i]) === 0) continue;
        else return i;
    }
    return -1;
}

/**
 * @description 计算序列中最后一个大于等于2的值（即所谓的大值）的下标，用于确定零值区的起始点。如果序列没有大值，则返回-1。
 */
function LastBigvalueIndex(seq) {
    for(let i = seq.length - 1; i >= 0; i--) {
        if(Math.abs(seq[i]) < 2) continue;
        else return i;
    }
    return -1;
}

/**
 * @description 使用指定的小值哈夫曼表（0/1），对小值四元组进行编码
 */
function EncodeQuadruple(v, w, x, y, tableSelect) {
    let key = (Math.abs(v) << 3) + (Math.abs(w) << 2) + (Math.abs(x) << 1) + (Math.abs(y) << 0);
    let hcode = HuffmanTableQuadruple[tableSelect][key];
    return hcode;
}

/**
 * @description 使用指定的大值哈夫曼表，对大值二元组进行编码，并返回相应的linbitsX、linbitsY
 */
function EncodeDuple(x, y, tableSelect) {
    x = Math.abs(x);
    y = Math.abs(y);
    let huffmanTableObject = HuffmanTableDuple[tableSelect]; // TODO 码表存在性检查
    let linbits = huffmanTableObject.linbits;
    let linbitsX = null;
    let linbitsY = null;
    if(x >= 15) {
        linbitsX = BinaryString(x - 15, linbits);
        x = 15;
    }
    if(y >= 15) {
        linbitsY = BinaryString(y - 15, linbits);
        y = 15;
    }
    let key = `${x} ${y}`;
    let hcode = (huffmanTableObject.table)[key];

    return {
        "huffmanCode": hcode,
        "linbits": linbits,
        "linbitsX": linbitsX,
        "linbitsY": linbitsY
    };
}

/**
 * @description 576点量化频谱分区：一般分为大值区（bigvalues）、小值区（smallvalues）和零值区（zeros）
 */
function PartitionQuantizedSpectrum(qspectrum576) {
    // 先计算小值区和零值区的起始位置
    let smallvaluesStartIndex = LastBigvalueIndex(qspectrum576) + 1;
    let zerosStartIndex = LastNzeroIndex(qspectrum576) + 1;
    // 小值区起点位置向后移动，对齐到偶数（因大值是成对的）
    if((smallvaluesStartIndex & 1) > 0) {
        smallvaluesStartIndex++;
    }
    // 零值区起点向后移动，使小值区长度(zerosStartIndex - smallvaluesStartIndex)为4的倍数
    while(((zerosStartIndex - smallvaluesStartIndex) & 3) > 0) {
        zerosStartIndex++;
    }
    // 如果零值区起点超过了频谱宽度，说明零值区的长度不足2，则将小值区起点向后移动两位
    // 例如 .. 3 2|0 0 0 0 1 0 - -|
    // 应为 .. 3 2 0 0|0 0 1 0|
    if(zerosStartIndex > qspectrum576.length) {
        smallvaluesStartIndex += 2;
        zerosStartIndex = qspectrum576.length;
    }
    // 返回各区域的边界
    return {
        "bigvalues": [0, smallvaluesStartIndex],
        "smallvalues": [smallvaluesStartIndex, zerosStartIndex],
        "zeros": [zerosStartIndex, qspectrum576.length]
    };
}

/**
 * @description 对量化频谱作哈夫曼编码
 */
function HuffmanEncode(qspectrum576) {
    let Bigvalues = -1,
        BigvalueTableSelect = new Array(),
        Region0Count = -1,
        Region1Count = -1,
        SmallvalueTableSelect = 0;

    // 首先检查最大值是否超过 8191+15=8206，如果超过，则返回null
    for(let i = 0; i < qspectrum576.length; i++) {
        if(Math.abs(qspectrum576[i]) > 8206) return null;
    }

    // 对量化后的频谱分区
    let partition = PartitionQuantizedSpectrum(qspectrum576);
    let BigvaluesPartition = partition.bigvalues;
    let SmallvaluesPartition = partition.smallvalues;

    Bigvalues = (BigvaluesPartition[1] - BigvaluesPartition[0]) / 2;

    let SFBands = ScaleFactorBands[SAMPLE_RATE][LONG_BLOCK];
    let BigvaluesCodeString = "", SmallvaluesCodeString = "";

    // 处理大值区
    // 以尺度因子频带（scalefactor bands，SFB）划分子区间（region）：按照C.1.5.4.4.6的推荐，选择大值区内的前三分之一SFB、后四分之一SFB为分割点，并保证分割点跟SFB的分割点对齐（即region划分不能跨过SFB）。（详见p27）
    // 保存分割点信息到region0_count和region1_count，具体是子区间0和1所包含的SFB数量减一。
    // 注意：对于短块部分（即非混合块模式的全部短块，以及混合块模式下高频方向的短块部分），这两个数量应相应地乘以3。详见p27。
    if(BigvaluesPartition[1] > 0) {
        // 确定大值区的尺度因子频带数目，计算分割点
        let LastSFBIndexOfBigvalues = -1;
        let BigvaluesEndIndex = BigvaluesPartition[1] - 1;
        for(let sfb = 0; sfb < SFBands.length; sfb++) {
            let sfbPartition = SFBands[sfb];
            // 因最后一个SFB并未延伸到频谱末端，所以应将其延伸到频谱末端
            if(sfb === SFBands.length - 1) sfbPartition = [sfbPartition[0], qspectrum576.length-1];
            if(BigvaluesEndIndex > 0 && BigvaluesEndIndex >= sfbPartition[0] && BigvaluesEndIndex <= sfbPartition[1]) {
                LastSFBIndexOfBigvalues = sfb;
                break;
            }
        }

        let SFBNumberInBigvalues = LastSFBIndexOfBigvalues + 1;
        let Region0_SFBNum = Math.round(SFBNumberInBigvalues / 3); // 注意：作为sideinfo的值应减1
        let Region1_SFBNum = SFBNumberInBigvalues - Math.round(SFBNumberInBigvalues / 4) - Region0_SFBNum;
        let Region2_SFBNum = SFBNumberInBigvalues - Region0_SFBNum - Region1_SFBNum;

        Region0Count = Region0_SFBNum - 1;
        Region1Count = Region1_SFBNum - 1;
        if(Region1_SFBNum <= 0) {
            Region1_SFBNum = Region2_SFBNum;
            Region2_SFBNum = 0;
            Region1Count = Region1_SFBNum - 1;
        }

        let region01 = SFBands[Region0_SFBNum][0]; // Region 1 的起点
        let region12 = SFBands[Region0_SFBNum + Region1_SFBNum][0]; // Region 2 的起点

        // 计算每个region的最大值，选取不同的Huffman编码表，保留码表编号到table_select
        let MaxValue0 = -1, MaxValue1 = -1, MaxValue2 = -1;
        for(let i = 0; i < region01; i++) {
            if(Math.abs(qspectrum576[i]) > MaxValue0) { MaxValue0 = Math.abs(qspectrum576[i]); }
        }
        for(let i = region01; i < region12; i++) {
            if(Math.abs(qspectrum576[i]) > MaxValue1) { MaxValue1 = Math.abs(qspectrum576[i]); }
        }
        for(let i = region12; i < BigvaluesPartition[1]; i++) {
            if(Math.abs(qspectrum576[i]) > MaxValue2){ MaxValue2 = Math.abs(qspectrum576[i]); }
        }

        let tableSelect0 = -1, tableSelect1 = -1, tableSelect2 = -1;
        for(let i = 0; i < HuffmanTableDuple.length; i++) {
            let htable = HuffmanTableDuple[i];
            if(htable === null) continue;
            let huffmanTableMaxValue = htable.maxvalue;
            if(tableSelect0 < 0 && MaxValue0 <= huffmanTableMaxValue) { tableSelect0 = i; }
            if(tableSelect1 < 0 && MaxValue1 <= huffmanTableMaxValue) { tableSelect1 = i; }
            if(tableSelect2 < 0 && MaxValue2 <= huffmanTableMaxValue) { tableSelect2 = i; }
            // 如果所有的表格都已确定，则终止循环
            if(tableSelect0 >= 0 && tableSelect1 >= 0 && tableSelect2 >= 0) break;
        }

        BigvalueTableSelect[0] = tableSelect0;
        BigvalueTableSelect[1] = tableSelect1;
        BigvalueTableSelect[2] = tableSelect2;

        // 按照格式对大值区进行编码
        let codeString0 = "", codeString1 = "", codeString2 = "";
        for(let i = 0; i < region01; i += 2) {
            let x = qspectrum576[i], y = qspectrum576[i+1];
            let huffman = EncodeDuple(x, y, tableSelect0);
            codeString0 += String(huffman.huffmanCode);
            if(huffman.linbitsX !== null) { codeString0 += String(huffman.linbitsX); }
            if(x !== 0) { codeString0 += String((x < 0) ? "1" : "0"); }
            if(huffman.linbitsY !== null) { codeString0 += String(huffman.linbitsY); }
            if(y !== 0) { codeString0 += String((y < 0) ? "1" : "0"); }
        }
        for(let i = region01; i < region12; i += 2) {
            let x = qspectrum576[i], y = qspectrum576[i+1];
            let huffman = EncodeDuple(x, y, tableSelect1);
            codeString1 += String(huffman.huffmanCode);
            if(huffman.linbitsX !== null) { codeString1 += String(huffman.linbitsX); }
            if(x !== 0) { codeString1 += String((x < 0) ? "1" : "0"); }
            if(huffman.linbitsY !== null) { codeString1 += String(huffman.linbitsY); }
            if(y !== 0) { codeString1 += String((y < 0) ? "1" : "0"); }
        }
        for(let i = region12; i < BigvaluesPartition[1]; i += 2) {
            let x = qspectrum576[i], y = qspectrum576[i+1];
            let huffman = EncodeDuple(x, y, tableSelect2);
            codeString2 += String(huffman.huffmanCode);
            if(huffman.linbitsX !== null) { codeString2 += String(huffman.linbitsX); }
            if(x !== 0) { codeString2 += String((x < 0) ? "1" : "0"); }
            if(huffman.linbitsY !== null) { codeString2 += String(huffman.linbitsY); }
            if(y !== 0) { codeString2 += String((y < 0) ? "1" : "0"); }
        }

        BigvaluesCodeString = String(codeString0) + String(codeString1) + String(codeString2);
    }

    // 处理小值区
    // 分别使用0和1两个四元组Huffman码表进行编码，计算总码长，选取较小者为最终的编码，并记录对应的码表编号0或1到count1table_select。
    if(SmallvaluesPartition[1] > SmallvaluesPartition[0]) {
        let codeStringA = "", codeStringB = "";
        // 分别使用两个码表进行编码，计算编码长度
        for(let i = SmallvaluesPartition[0]; i < SmallvaluesPartition[1]; i += 4) {
            let v = qspectrum576[i], w = qspectrum576[i+1], x = qspectrum576[i+2], y = qspectrum576[i+3];
            codeStringA += String(EncodeQuadruple(v, w, x, y, 0));
            if(v !== 0) { codeStringA += String((v < 0) ? "1" : "0"); }
            if(w !== 0) { codeStringA += String((w < 0) ? "1" : "0"); }
            if(x !== 0) { codeStringA += String((x < 0) ? "1" : "0"); }
            if(y !== 0) { codeStringA += String((y < 0) ? "1" : "0"); }

            codeStringB += String(EncodeQuadruple(v, w, x, y, 1));
            if(v !== 0) { codeStringB += String((v < 0) ? "1" : "0"); }
            if(w !== 0) { codeStringB += String((w < 0) ? "1" : "0"); }
            if(x !== 0) { codeStringB += String((x < 0) ? "1" : "0"); }
            if(y !== 0) { codeStringB += String((y < 0) ? "1" : "0"); }
        }

        if(codeStringA.length <= codeStringB.length) {
            SmallvaluesCodeString = codeStringA;
            SmallvalueTableSelect = 0;
        }
        else {
            SmallvaluesCodeString = codeStringB;
            SmallvalueTableSelect = 1;
        }
    }

    // 将大值区和小值区编码拼接起来
    let HuffmanCodeString = BigvaluesCodeString + SmallvaluesCodeString;

    return {
        "Spectrum576": qspectrum576,
        "Partition": partition,
        "CodeString": HuffmanCodeString,
        "Bigvalues": Bigvalues,
        "BigvalueTableSelect": BigvalueTableSelect,
        "Region0Count": Region0Count,
        "Region1Count": Region1Count,
        "SmallvalueTableSelect": SmallvalueTableSelect
    };

}

/**
 * @description 短块频谱重排
 */
function ReorderShortBlockSpectrum(qspects) {
    let qspect576 = new Array();
    let SFBands = ScaleFactorBands[SAMPLE_RATE][SHORT_BLOCK];
    for(let sfb = 0; sfb < SFBands.length; sfb++) {
        let sfbPartition = SFBands[sfb];
        // 因最后一个SFB并未延伸到频谱末端(191)，所以应将其延伸到频谱末端
        if(sfb === SFBands.length - 1) sfbPartition = [sfbPartition[0], 191];
        for(let w = 0; w < 3; w++) {
            for(let i = sfbPartition[0]; i <= sfbPartition[1]; i++) {
                qspect576.push(qspects[w][i]);
            }
        }
    }
    return qspect576;
}
// let qspects = [[],[],[]];
// for(let i = 0; i < 192; i++) {
//     qspects[0][i] = i;
//     qspects[1][i] = i + 10000;
//     qspects[2][i] = i + 20000;
// }
// console.log(ReorderShortBlockSpectrum(qspects));

/**
 * @description 576点短块频谱拆分成3个短块频谱
 */
function ReconstructShortBlockSpectrum(spect576) {
    let spect = new Array();
        spect[0] = new Array();
        spect[1] = new Array();
        spect[2] = new Array();
    let SFBands = ScaleFactorBands[SAMPLE_RATE][SHORT_BLOCK];
    let offset = 0;
    for(let sfb = 0; sfb < SFBands.length; sfb++) {
        let sfbPartition = SFBands[sfb];
        // 因最后一个SFB并未延伸到频谱末端(191)，所以应将其延伸到频谱末端
        if(sfb === SFBands.length - 1) sfbPartition = [sfbPartition[0], 191];
        for(let w = 0; w < 3; w++) {
            for(let i = sfbPartition[0]; i <= sfbPartition[1]; i++) {
                spect[w][i] = spect576[offset];
                offset++;
            }
        }
    }
    return spect;
}

/**
 * @description 内层循环（码率控制循环）
 */
function InnerLoop(Spectrum, windowType, bitRateLimit) {
    let globalGain, subblockGain;
    let huffman;
    let quantizedSpectrum576;
    for(let qquant = 0; qquant < 256; qquant++) { // global_gain为8bit
        let quantanf;
        // 长块
        if(windowType !== WINDOW_SHORT) {
            // 量化
            let LongBlockSpectrum = Spectrum[0];
            let QuantizedLongBlockSpectrum = new Array();
            quantanf = 8 * Math.log(SFM(LongBlockSpectrum));
            for(let i = 0; i < LongBlockSpectrum.length; i++) {
                let xr = LongBlockSpectrum[i];
                QuantizedLongBlockSpectrum[i] = Math.sign(xr) * Quantize(xr, quantanf + qquant);
            }
            quantizedSpectrum576 = QuantizedLongBlockSpectrum;

            globalGain = quantanf + qquant + 210;
        }
        // 短块
        else {
            subblockGain = new Array()
            let QuantizedShortBlockSpectrum = new Array();
            // 对每个短块作量化
            for(let w = 0; w < 3; w++) {
                let SubblockSpectrum = Spectrum[w];
                let QuantizedSubblockSpectrum = new Array();
                quantanf = 8 * Math.log(SFM(SubblockSpectrum));
                for(let i = 0; i < SubblockSpectrum.length; i++) {
                    let xr = SubblockSpectrum[i];
                    QuantizedSubblockSpectrum[i] = Math.sign(xr) * Quantize(xr, quantanf + qquant);
                }
                QuantizedShortBlockSpectrum[w] = QuantizedSubblockSpectrum;

                subblockGain[w] = quantanf + qquant + 210;
            }
            // 将短块频谱重排成连续的576点频谱
            let ReorderedQuantizedShortBlockSpectrum = ReorderShortBlockSpectrum(QuantizedShortBlockSpectrum);
            quantizedSpectrum576 = ReorderedQuantizedShortBlockSpectrum;

            /**
             * TODO 不清楚subblockGain是如何计算的，以及subblockGain与globalGain的关系。因此这里用三个子块的量化参数的最大值代替整个短块granule的globalGain。
             * 至于globalGain与每个子块的实际量化参数之间的差异，由scalefactor来抵消掉。
             */ 
            globalGain = Math.max(subblockGain[0], subblockGain[1], subblockGain[2]);
        }

        // 哈夫曼编码
        huffman = HuffmanEncode(quantizedSpectrum576);

        // 满足条件退出
        if(huffman !== null && huffman.CodeString.length < bitRateLimit) {
            return {
                huffman: huffman,
                globalGain: globalGain,
                subblockGain: subblockGain,
                qquant: qquant,
                quantizedSpectrum576: quantizedSpectrum576
            };
        }
    }
    // 量化超时
    return null;
}

/**
 * @description 外层循环（噪声控制循环）
 */
function OuterLoop(Spectrum, windowType, bitRateLimit, xmin) {
    let LongBlockScalefactors = new Array();
    let ShortBlockScalefactors = new Array();
    let ScalefactorScale = 0;

    let ifqstep = (ScalefactorScale === 0) ? 1.4142135623730951 : 2;

    let LongBlockSFBNumber = ScaleFactorBands[SAMPLE_RATE][LONG_BLOCK].length;
    let ShortBlockSFBNumber = ScaleFactorBands[SAMPLE_RATE][SHORT_BLOCK].length;
    // 初始化尺度因子
    for(let i = 0; i < LongBlockSFBNumber; i++) {
        LongBlockScalefactors[i] = 0;
    }
    for(let i = 0; i < ShortBlockSFBNumber; i++) {
        ShortBlockScalefactors[i] = 0;
    }

    let outerLoopCount = 0;

    while(outerLoopCount < 16) {

        console.log(`外层循环第 ${outerLoopCount} 次`);

        // 量化（内层循环：码率控制循环）
        console.log(`  === 内层循环开始 ===`);
        console.log(Spectrum[0]);
        let quantResult = InnerLoop(Spectrum, windowType, bitRateLimit);
        console.log(`  量化步数qquant：${quantResult.qquant}`);
        console.log(`  Huffman码长：${quantResult.huffman.CodeString.length}`);
        console.log(`  globalGain：${quantResult.globalGain}`);
        console.log(`  编码结果：`);
        console.log(quantResult.huffman);
        console.log(`  === 内层循环结束 ===`);

        // 计算量化误差
        if(windowType !== WINDOW_SHORT) {
            let xfsf = CalculateQuantDistortion(Spectrum[0], quantResult.quantizedSpectrum576, quantResult.globalGain - 210, LONG_BLOCK);
            console.log(`  长块量化误差：`);
            console.log(xfsf);

            let sfbsOverXmin = new Array();

            // C.1.5.4.3.5
            for(let sbindex = 0; sbindex < LongBlockSFBNumber; sbindex++) {
                if(xfsf[sbindex] > xmin[sbindex]) {
                    sfbsOverXmin.push(sbindex);
                    console.log(`SFB超限：${sbindex}`);
                    xmin[sbindex] *= (ifqstep * ifqstep);
                    LongBlockScalefactors[sbindex] = LongBlockScalefactors[sbindex] + 1;
                    let sfbPartition = ScaleFactorBands[SAMPLE_RATE][LONG_BLOCK][sbindex];
                    for(let i = sfbPartition[0]; i <= sfbPartition[1]; i++) {
                        Spectrum[0][i] = Spectrum[0][i] * ifqstep;
                    }
                }
            }

            console.log(`放大后的尺度因子频带：`);
            console.log(LongBlockScalefactors);

            let result = {
                Scalefactors: LongBlockScalefactors,
                ScalefactorScale: ScalefactorScale
            };

            // 检查退出条件
            // 1 所有的尺度因子频带都被放大过？如果是，则退出
            let isAllSfbAmplified = true;
            for(let sb = 0; sb < LongBlockSFBNumber; sb++) {
                if(LongBlockScalefactors[sb] <= 0) { isAllSfbAmplified = false; break; }
            }
            if(isAllSfbAmplified === true) {
                return result;
            }
            // 2 尺度因子的值是否有超过其各自的动态范围？如果有超过，则退出
            let isScalefactorExceeded = false;
            for(let sb = 0; sb <= 10; sb++) {
                if(LongBlockScalefactors[sb] > 15) { isScalefactorExceeded = true; break; }
            }
            for(let sb = 11; sb <= 20; sb++) {
                if(LongBlockScalefactors[sb] > 7) { isScalefactorExceeded = true; break; }
            }
            if(isScalefactorExceeded === true) {
                return result;
            }
            // 3 还有超限的尺度因子频带吗？如果没有，则退出
            if(sfbsOverXmin.length <= 0) {
                return result;
            }
        }
        else {
            // let reconstructedQuantized = ReconstructShortBlockSpectrum(quantResult.quantizedSpectrum576);
            // let distortion0 = CalculateQuantDistortion(Spectrum[0], reconstructedQuantized[0], quantResult.globalGain - 210, SHORT_BLOCK);
            // let distortion1 = CalculateQuantDistortion(Spectrum[1], reconstructedQuantized[1], quantResult.globalGain - 210, SHORT_BLOCK);
            // let distortion2 = CalculateQuantDistortion(Spectrum[2], reconstructedQuantized[2], quantResult.globalGain - 210, SHORT_BLOCK);
            // console.log(`  短块量化误差：`);
            // console.log(distortion0);
            // console.log(distortion1);
            // console.log(distortion2);
            return {
                Scalefactors: ShortBlockScalefactors,
                ScalefactorScale: ScalefactorScale
            };
        }

        outerLoopCount++;
    }
}
