const unicode = [];
{
    // ---------- C0 控制字符 (0–31) ----------
    const c0Names = [
        'NUL','SOH','STX','ETX','EOT','ENQ','ACK','BEL','BS','HT',
        'LF','VT','FF','CR','SO','SI','DLE','DC1','DC2','DC3','DC4',
        'NAK','SYN','ETB','CAN','EM','SUB','ESC','FS','GS','RS','US'
    ];
    const c0Carets = [
        '^@','^A','^B','^C','^D','^E','^F','^G','^H','^I',
        '^J','^K','^L','^M','^N','^O','^P','^Q','^R','^S','^T',
        '^U','^V','^W','^X','^Y','^Z','^[','^\\','^]','^^','^_'
    ];
    const c0Explains = [
        'Null Character','Start of Heading','Start of Text','End of Text','End of Transmission',
        'Enquiry','Acknowledge','Bell','Backspace','Horizontal Tab',
        'Line Feed','Vertical Tab','Form Feed','Carriage Return','Shift Out',
        'Shift In','Data Link Escape','Device Control 1 (XON)','Device Control 2',
        'Device Control 3 (XOFF)','Device Control 4','Negative Acknowledge',
        'Synchronous Idle','End of Transmission Block','Cancel','End of Medium',
        'Substitute','Escape','File Separator','Group Separator','Record Separator','Unit Separator'
    ];
    for (let i = 0; i < 32; i++) {
        unicode.push({
            type: 0,
            symbol: c0Names[i],
            explain: c0Explains[i],
            caret: c0Carets[i]
        });
    }

    // ---------- 空格 (32) ----------
    unicode.push({
    type: 2,
    symbol: ' ',
    explain: 'Space',
    caret: null
    });

    // ---------- 可打印字符 (33–126) ----------
    for (let i = 33; i <= 126; i++) {
        unicode.push({
            type: 1,
            symbol: String.fromCharCode(i),
            explain: null,
            caret: null
        });
    }

    // ---------- DEL (127) ----------
    unicode.push({
    type: 0,
    symbol: 'DEL',
    explain: 'Delete',
    caret: '^?'
    });

    // ---------- C1 控制字符 (128–159) ----------
    const c1Names = [
        'PAD','HOP','BPH','NBH','IND','NEL','SSA','ESA','HTS','HTJ',
        'VTS','PLD','PLU','RI','SS2','SS3','DCS','PU1','PU2','STS',
        'CCH','MW','SPA','EPA','SOS','SGCI','SCI','CSI','ST','OSC',
        'PM','APC'
    ];
    const c1Explains = [
        'Padding Character','High Octet Preset','Break Permitted Here','No Break Here',
        'Index','Next Line','Start of Selected Area','End of Selected Area',
        'Horizontal Tabulation Set','Horizontal Tabulation Justify',
        'Vertical Tabulation Set','Partial Line Down','Partial Line Up',
        'Reverse Index','Single Shift 2','Single Shift 3',
        'Device Control String','Private Use 1','Private Use 2',
        'Set Transmit State','Cancel Character','Message Waiting',
        'Start of Protected Area','End of Protected Area',
        'Start of String','Single Graphic Character Introducer',
        'Single Character Introducer','Control Sequence Introducer',
        'String Terminator','Operating System Command',
        'Privacy Message','Application Program Command'
    ];
    for (let i = 0; i < 32; i++) {
        unicode.push({
            type: 0,
            symbol: c1Names[i],
            explain: c1Explains[i],
            caret: null   // 无标准 caret 表示
        });
    }

    // ---------- 不间断空格 (160) ----------
    unicode.push({
    type: 2,
    symbol: '\u00A0',
    explain: 'Non-breaking space',
    caret: null
    });

    // ---------- 可打印字符 (161–255) ----------
    for (let i = 161; i <= 255; i++) {
        unicode.push({
            type: 1,
            symbol: String.fromCharCode(i),
            explain: null,
            caret: null
        });
    }
}
// 验证长度 (256)
// console.assert(unicode.length === 256, 'Should have 256 entries');

// 导出（在 Node.js 或浏览器模块中可用）
// export default unicode;
// 若在全局作用域，直接使用 unicode 即可


function control_char(symbol, number) {
    switch (symbol) {
        case "LF": {
            output_area.innerHTML += '<br>'.repeat(number);
        }
    }
}