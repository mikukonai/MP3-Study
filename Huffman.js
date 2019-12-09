
/**
 * 哈夫曼编码表
 */

const HuffmanTableQuadruple = [
    // Table A
    ["1", "0101", "0100", "00101", "0110", "000101", "00100", "000100", "0111", "00011", "00110", "000000", "00111", "000010", "000011", "000001"],
    // Table B
    ["1111", "1110", "1101", "1100", "1011", "1010", "1001", "1000", "0111", "0110", "0101", "0100", "0011", "0010", "0001", "0000"]
];

// 与16~23共享
const HuffmanTable16 = {
    "0 0": "1","0 1": "0101","0 2": "001110","0 3": "00101100","0 4": "001001010","0 5": "000111111","0 6": "0001101110","0 7": "0001011101",
    "0 8": "00010101100","0 9": "00010010101","0 10": "00010001010","0 11": "000011110010","0 12": "000011100001","0 13": "000011000011","0 14": "0000101111000","0 15": "000010001",
    "1 0": "011","1 1": "0100","1 2": "001100","1 3": "0010100","1 4": "00100011","1 5": "000111110","1 6": "000110101","1 7": "000101111",
    "1 8": "0001010011","1 9": "0001001011","1 10": "0001000100","1 11": "00001110111","1 12": "000011001001","1 13": "00001101011","1 14": "000011001111","1 15": "00001001",
    "2 0": "001111","2 1": "001101","2 2": "0010111","2 3": "00100110","2 4": "001000011","2 5": "000111010","2 6": "0001100111","2 7": "0001011010",
    "2 8": "00010100001","2 9": "0001001000","2 10": "00001111111","2 11": "00001110101","2 12": "00001101110","2 13": "000011010001","2 14": "000011001110","2 15": "000010000",
    "3 0": "00101101","3 1": "0010101","3 2": "00100111","3 3": "001000101","3 4": "001000000","3 5": "0001110010","3 6": "0001100011","3 7": "0001010111",
    "3 8": "00010011110","3 9": "00010001100","3 10": "000011111100","3 11": "000011010100","3 12": "000011000111","3 13": "0000110000011","3 14": "0000101101101","3 15": "0000011010",
    "4 0": "001001011","4 1": "00100100","4 2": "001000100","4 3": "001000001","4 4": "0001110011","4 5": "0001100101","4 6": "00010110011","4 7": "00010100100",
    "4 8": "00010011011","4 9": "000100001000","4 10": "000011110110","4 11": "000011100010","4 12": "0000110001011","4 13": "0000101111110","4 14": "0000101101010","4 15": "000001001",
    "5 0": "001000010","5 1": "00011110","5 2": "000111011","5 3": "000111000","5 4": "0001100110","5 5": "00010111001","5 6": "00010101101","5 7": "000100001001",
    "5 8": "00010001110","5 9": "000011111101","5 10": "000011101000","5 11": "0000110010000","5 12": "0000110000100","5 13": "0000101111010","5 14": "00000110111101","5 15": "0000010000",
    "6 0": "0001101111","6 1": "000110110","6 2": "000110100","6 3": "0001100100","6 4": "00010111000","6 5": "00010110010","6 6": "00010100000","6 7": "00010000101",
    "6 8": "000100000001","6 9": "000011110100","6 10": "000011100100","6 11": "000011011001","6 12": "0000110000001","6 13": "0000101101110","6 14": "00001011001011","6 15": "0000001010",
    "7 0": "0001100010","7 1": "000110000","7 2": "0001011011","7 3": "0001011000","7 4": "00010100101","7 5": "00010011101","7 6": "00010010100","7 7": "000100000101",
    "7 8": "000011111000","7 9": "0000110010111","7 10": "0000110001101","7 11": "0000101110100","7 12": "0000101111100","7 13": "000001101111001","7 14": "000001101110100","7 15": "0000001000",
    "8 0": "0001010101","8 1": "0001010100","8 2": "0001010001","8 3": "00010011111","8 4": "00010011100","8 5": "00010001111","8 6": "000100000100","8 7": "000011111001",
    "8 8": "0000110101011","8 9": "0000110010001","8 10": "0000110001000","8 11": "0000101111111","8 12": "00001011010111","8 13": "00001011001001","8 14": "00001011000100","8 15": "0000000111",
    "9 0": "00010011010","9 1": "0001001100","9 2": "0001001001","9 3": "00010001101","9 4": "00010000011","9 5": "000100000000","9 6": "000011110101","9 7": "0000110101010",
    "9 8": "0000110010110","9 9": "0000110001010","9 10": "0000110000000","9 11": "00001011011111","9 12": "0000101100111","9 13": "00001011000110","9 14": "0000101100000","9 15": "00000001011",
    "10 0": "00010001011","10 1": "00010000001","10 2": "0001000011","10 3": "00001111101","10 4": "000011110111","10 5": "000011101001","10 6": "000011100101","10 7": "000011011011",
    "10 8": "0000110001001","10 9": "00001011100111","10 10": "00001011100001","10 11": "00001011010000","10 12": "000001101110101","10 13": "000001101110010","10 14": "00000110110111","10 15": "0000000100",
    "11 0": "000011110011","11 1": "00001111000","11 2": "00001110110","11 3": "00001110011","11 4": "000011100011","11 5": "000011011111","11 6": "0000110001100","11 7": "00001011101010",
    "11 8": "00001011100110","11 9": "00001011100000","11 10": "00001011010001","11 11": "00001011001000","11 12": "00001011000010","11 13": "0000011011111","11 14": "00000110110100","11 15": "00000000110",
    "12 0": "000011001010","12 1": "000011100000","12 2": "000011011110","12 3": "000011011010","12 4": "000011011000","12 5": "0000110000101","12 6": "0000110000010","12 7": "0000101111101",
    "12 8": "0000101101100","12 9": "000001101111000","12 10": "00000110111011","12 11": "00001011000011","12 12": "00000110111000","12 13": "00000110110101","12 14": "0000011011000000","12 15": "00000000100",
    "13 0": "00001011101011","13 1": "000011010011","13 2": "000011010010","13 3": "000011010000","13 4": "0000101110010","13 5": "0000101111011","13 6": "00001011011110","13 7": "00001011010011",
    "13 8": "00001011001010","13 9": "0000011011000111","13 10": "000001101110011","13 11": "000001101101101","13 12": "000001101101100","13 13": "00000110110000011","13 14": "000001101100001","13 15": "00000000010",
    "14 0": "0000101111001","14 1": "0000101110001","14 2": "00001100110","14 3": "000010111011","14 4": "00001011010110","14 5": "00001011010010","14 6": "0000101100110","14 7": "00001011000111",
    "14 8": "00001011000101","14 9": "000001101100010","14 10": "0000011011000110","14 11": "000001101100111","14 12": "00000110110000010","14 13": "000001101100110","14 14": "00000110110010","14 15": "00000000000",
    "15 0": "000001100","15 1": "00001010","15 2": "00000111","15 3": "000001011","15 4": "000001010","15 5": "0000010001","15 6": "0000001011","15 7": "0000001001",
    "15 8": "00000001101","15 9": "00000001100","15 10": "00000001010","15 11": "00000000111","15 12": "00000000101","15 13": "00000000011","15 14": "00000000001","15 15": "00000011"
};

const HuffmanTable24 = {
    "0 0": "1111","0 1": "1101","0 2": "101110","0 3": "1010000","0 4": "10010010","0 5": "100000110","0 6": "011111000","0 7": "0110110010",
    "0 8": "0110101010","0 9": "01010011101","0 10": "01010001101","0 11": "01010001001","0 12": "01001101101","0 13": "01000000101","0 14": "010000001000","0 15": "001011000",
    "1 0": "1110","1 1": "1100","1 2": "10101","1 3": "100110","1 4": "1000111","1 5": "10000010","1 6": "01111010","1 7": "011011000",
    "1 8": "011010001","1 9": "011000110","1 10": "0101000111","1 11": "0101011001","1 12": "0100111111","1 13": "0100101001","1 14": "0100010111","1 15": "00101010",
    "2 0": "101111","2 1": "10110","2 2": "101001","2 3": "1001010","2 4": "1000100","2 5": "10000000","2 6": "01111000","2 7": "011011101",
    "2 8": "011001111","2 9": "011000010","2 10": "010110110","2 11": "0101010100","2 12": "0100111011","2 13": "0100100111","2 14": "01000011101","2 15": "0010010",
    "3 0": "1010001","3 1": "100111","3 2": "1001011","3 3": "1000110","3 4": "10000110","3 5": "01111101","3 6": "01110100","3 7": "011011100",
    "3 8": "011001100","3 9": "010111110","3 10": "010110010","3 11": "0101000101","3 12": "0100110111","3 13": "0100100101","3 14": "0100001111","3 15": "0010000",
    "4 0": "10010011","4 1": "1001000","4 2": "1000101","4 3": "10000111","4 4": "01111111","4 5": "01110110","4 6": "01110000","4 7": "011010010",
    "4 8": "011001000","4 9": "010111100","4 10": "0101100000","4 11": "0101000011","4 12": "0100110010","4 13": "0100011101","4 14": "01000011100","4 15": "0001110",
    "5 0": "100000111","5 1": "1000010","5 2": "10000001","5 3": "01111110","5 4": "01110111","5 5": "01110010","5 6": "011010110","5 7": "011001010",
    "5 8": "011000000","5 9": "010110100","5 10": "0101010101","5 11": "0100111101","5 12": "0100101101","5 13": "0100011001","5 14": "0100000110","5 15": "0001100",
    "6 0": "011111001","6 1": "01111011","6 2": "01111001","6 3": "01110101","6 4": "01110001","6 5": "011010111","6 6": "011001110","6 7": "011000011",
    "6 8": "010111001","6 9": "0101011011","6 10": "0101001010","6 11": "0100110100","6 12": "0100100011","6 13": "0100010000","6 14": "01000001000","6 15": "0001010",
    "7 0": "0110110011","7 1": "01110011","7 2": "01101111","7 3": "01101101","7 4": "011010011","7 5": "011001011","7 6": "011000100","7 7": "010111011",
    "7 8": "0101100001","7 9": "0101001100","7 10": "0100111001","7 11": "0100101010","7 12": "0100011011","7 13": "01000010011","7 14": "00101111101","7 15": "00010001",
    "8 0": "0110101011","8 1": "011010100","8 2": "011010000","8 3": "011001101","8 4": "011001001","8 5": "011000001","8 6": "010111010","8 7": "010110001",
    "8 8": "010101001","8 9": "0101000000","8 10": "0100101111","8 11": "0100011110","8 12": "0100001100","8 13": "01000000010","8 14": "00101111001","8 15": "00010000",
    "9 0": "0101001111","9 1": "011000111","9 2": "011000101","9 3": "010111111","9 4": "010111101","9 5": "010110101","9 6": "010101110","9 7": "0101001101",
    "9 8": "0101000001","9 9": "0100110001","9 10": "0100100001","9 11": "0100010011","9 12": "01000001001","9 13": "00101111011","9 14": "00101110011","9 15": "00001011",
    "10 0": "01010011100","10 1": "010111000","10 2": "010110111","10 3": "010110011","10 4": "010101111","10 5": "0101011000","10 6": "0101001011","10 7": "0100111010",
    "10 8": "0100110000","10 9": "0100100010","10 10": "0100010101","10 11": "01000010010","10 12": "00101111111","10 13": "00101110101","10 14": "00101101110","10 15": "00001010",
    "11 0": "01010001100","11 1": "0101011010","11 2": "010101011","11 3": "010101000","11 4": "010100100","11 5": "0100111110","11 6": "0100110101","11 7": "0100101011",
    "11 8": "0100011111","11 9": "0100010100","11 10": "0100000111","11 11": "01000000001","11 12": "00101110111","11 13": "00101110000","11 14": "00101101010","11 15": "00000110",
    "12 0": "01010001000","12 1": "0101000010","12 2": "0100111100","12 3": "0100111000","12 4": "0100110011","12 5": "0100101110","12 6": "0100100100","12 7": "0100011100",
    "12 8": "0100001101","12 9": "0100000101","12 10": "01000000000","12 11": "00101111000","12 12": "00101110010","12 13": "00101101100","12 14": "00101100111","12 15": "00000100",
    "13 0": "01001101100","13 1": "0100101100","13 2": "0100101000","13 3": "0100100110","13 4": "0100100000","13 5": "0100011010","13 6": "0100010001","13 7": "0100001010",
    "13 8": "01000000011","13 9": "00101111100","13 10": "00101110110","13 11": "00101110001","13 12": "00101101101","13 13": "00101101001","13 14": "00101100101","13 15": "00000010",
    "14 0": "010000001001","14 1": "0100011000","14 2": "0100010110","14 3": "0100010010","14 4": "0100001011","14 5": "0100001000","14 6": "0100000011","14 7": "00101111110",
    "14 8": "00101111010","14 9": "00101110100","14 10": "00101101111","14 11": "00101101011","14 12": "00101101000","14 13": "00101100110","14 14": "00101100100","14 15": "00000000",
    "15 0": "00101011","15 1": "0010100","15 2": "0010011","15 3": "0010001","15 4": "0001111","15 5": "0001101","15 6": "0001011","15 7": "0001001",
    "15 8": "0000111","15 9": "0000110","15 10": "0000100","15 11": "00000111","15 12": "00000101","15 13": "00000011","15 14": "00000001","15 15": "0011"
};

const HuffmanTableDuple = [
    // Table 0
    {
        "maxvalue": 0,
        "linbits": 0,
        "table": {
            "0 0": ""
        }
    },

    // Table 1
    {
        "maxvalue": 1,
        "linbits": 0,
        "table": {
            "0 0": "1","0 1": "001","1 0": "01","1 1": "000"
        }
    },

    // Table 2
    {
        "maxvalue": 2,
        "linbits": 0,
        "table": {
            "0 0": "1","0 1": "010","0 2": "000001","1 0": "011","1 1": "001","1 2": "00001","2 0": "00011","2 1": "00010","2 2": "000000"
        }
    },

    // Table 3
    {
        "maxvalue": 2,
        "linbits": 0,
        "table": {
            "0 0": "11", "0 1": "10", "0 2": "000001", "1 0": "001", "1 1": "01", "1 2": "00001", "2 0": "00011", "2 1": "00010", "2 2": "000000"
        }
    },

    // Table 4
    null,

    // Table 5
    {
        "maxvalue": 3,
        "linbits": 0,
        "table": {
            "0 0": "1", "0 1": "010", "0 2": "000110", "0 3": "0000101", "1 0": "011", "1 1": "001", "1 2": "000100", "1 3": "0000100", "2 0": "000111", "2 1": "000101", "2 2": "0000111", "2 3": "00000001", "3 0": "0000110", "3 1": "000001", "3 2": "0000001", "3 3": "00000000"
        }
    },

    // Table 6
    {
        "maxvalue": 3,
        "linbits": 0,
        "table": {
            "0 0": "111", "0 1": "011", "0 2": "00101", "0 3": "0000001", "1 0": "110", "1 1": "10", "1 2": "0011", "1 3": "00010", "2 0": "0101", "2 1": "0100", "2 2": "00100", "2 3": "000001", "3 0": "000011", "3 1": "00011", "3 2": "000010", "3 3": "0000000"
        }
    },

    // Table 7
    {
        "maxvalue": 5,
        "linbits": 0,
        "table": {
            "0 0": "1", "0 1": "010", "0 2": "001010", "0 3": "00010011", "0 4": "00010000", "0 5": "000001010", "1 0": "011", "1 1": "0011", "1 2": "000111", "1 3": "0001010", "1 4": "0000101", "1 5": "00000011", "2 0": "001011", "2 1": "00100", "2 2": "0001101", "2 3": "00010001", "2 4": "00001000", "2 5": "000000100", "3 0": "0001100", "3 1": "0001011", "3 2": "00010010", "3 3": "000001111", "3 4": "000001011", "3 5": "000000010", "4 0": "0000111", "4 1": "0000110", "4 2": "00001001", "4 3": "000001110", "4 4": "000000011", "4 5": "0000000001", "5 0": "00000110", "5 1": "00000100", "5 2": "000000101", "5 3": "0000000011", "5 4": "0000000010", "5 5": "0000000000"
        }
    },

    // Table 8
    {
        "maxvalue": 5,
        "linbits": 0,
        "table": {
            "0 0": "11", "0 1": "100", "0 2": "000110", "0 3": "00010010", "0 4": "00001100", "0 5": "000000101", "1 0": "101", "1 1": "01", "1 2": "0010", "1 3": "00010000", "1 4": "00001001", "1 5": "00000011", "2 0": "000111", "2 1": "0011", "2 2": "000101", "2 3": "00001110", "2 4": "00000111", "2 5": "000000011", "3 0": "00010011", "3 1": "00010001", "3 2": "00001111", "3 3": "000001101", "3 4": "000001010", "3 5": "0000000100", "4 0": "00001101", "4 1": "0000101", "4 2": "00001000", "4 3": "000001011", "4 4": "0000000101", "4 5": "0000000001", "5 0": "000001100", "5 1": "00000100", "5 2": "000000100", "5 3": "000000001", "5 4": "00000000001", "5 5": "00000000000"
        }
    },

    // Table 9
    {
        "maxvalue": 5,
        "linbits": 0,
        "table": {
            "0 0": "111", "0 1": "101", "0 2": "01001", "0 3": "001110", "0 4": "00001111", "0 5": "000000111", "1 0": "110", "1 1": "100", "1 2": "0101", "1 3": "00101", "1 4": "000110", "1 5": "00000111", "2 0": "0111", "2 1": "0110", "2 2": "01000", "2 3": "001000", "2 4": "0001000", "2 5": "00000101", "3 0": "001111", "3 1": "00110", "3 2": "001001", "3 3": "0001010", "3 4": "0000101", "3 5": "00000001", "4 0": "0001011", "4 1": "000111", "4 2": "0001001", "4 3": "0000110", "4 4": "00000100", "4 5": "000000001", "5 0": "00001110", "5 1": "0000100", "5 2": "00000110", "5 3": "00000010", "5 4": "000000110", "5 5": "000000000"
        }
    },

    // Table 10
    {
        "maxvalue": 7,
        "linbits": 0,
        "table": {
            "0 0": "1", "0 1": "010", "0 2": "001010", "0 3": "00010111", "0 4": "000100011", "0 5": "000011110", "0 6": "000001100", "0 7": "0000010001",
            "1 0": "011", "1 1": "0011", "1 2": "001000", "1 3": "0001100", "1 4": "00010010", "1 5": "000010101", "1 6": "00001100", "1 7": "00000111",
            "2 0": "001011", "2 1": "001001", "2 2": "0001111", "2 3": "00010101", "2 4": "000100000", "2 5": "0000101000", "2 6": "000010011", "2 7": "000000110",
            "3 0": "0001110", "3 1": "0001101", "3 2": "00010110", "3 3": "000100010", "3 4": "0000101110", "3 5": "0000010111", "3 6": "000010010", "3 7": "0000000111",
            "4 0": "00010100", "4 1": "00010011", "4 2": "000100001", "4 3": "0000101111", "4 4": "0000011011", "4 5": "0000010110", "4 6": "0000001001", "4 7": "0000000011",
            "5 0": "000011111", "5 1": "000010110", "5 2": "0000101001", "5 3": "0000011010", "5 4": "00000010101", "5 5": "00000010100", "5 6": "0000000101", "5 7": "00000000011",
            "6 0": "00001110", "6 1": "00001101", "6 2": "000001010", "6 3": "0000001011", "6 4": "0000010000", "6 5": "0000000110", "6 6": "00000000101", "6 7": "00000000001",
            "7 0": "000001001", "7 1": "00001000", "7 2": "000000111", "7 3": "0000001000", "7 4": "0000000100", "7 5": "00000000100", "7 6": "00000000010", "7 7": "00000000000"
        }
    },

    // Table 11
    {
        "maxvalue": 7,
        "linbits": 0,
        "table": {
            "0 0": "11", "0 1": "100", "0 2": "01010", "0 3": "0011000", "0 4": "00100010", "0 5": "000100001", "0 6": "00010101", "0 7": "000001111",
            "1 0": "101", "1 1": "011", "1 2": "0100", "1 3": "001010", "1 4": "00100000", "1 5": "00010001", "1 6": "0001011", "1 7": "00001010",
            "2 0": "01011", "2 1": "00111", "2 2": "001101", "2 3": "0010010", "2 4": "00011110", "2 5": "000011111", "2 6": "00010100", "2 7": "00000101",
            "3 0": "0011001", "3 1": "001011", "3 2": "0010011", "3 3": "000111011", "3 4": "00011011", "3 5": "0000010010", "3 6": "00001100", "3 7": "000000101",
            "4 0": "00100011", "4 1": "00100001", "4 2": "00011111", "4 3": "000111010", "4 4": "000011110", "4 5": "0000010000", "4 6": "000000111", "4 7": "0000000101",
            "5 0": "00011100", "5 1": "00011010", "5 2": "000100000", "5 3": "0000010011", "5 4": "0000010001", "5 5": "00000001111", "5 6": "0000001000", "5 7": "00000001110",
            "6 0": "00001110", "6 1": "0001100", "6 2": "0001001", "6 3": "00001101", "6 4": "000001110", "6 5": "0000001001", "6 6": "0000000100", "6 7": "0000000001",
            "7 0": "00001011", "7 1": "0000100", "7 2": "00000110", "7 3": "000000110", "7 4": "0000000110", "7 5": "0000000011", "7 6": "0000000010", "7 7": "0000000000"
        }
    },

    // Table 12
    {
        "maxvalue": 7,
        "linbits": 0,
        "table": {
            "0 0": "1001", "0 1": "110", "0 2": "10000", "0 3": "0100001", "0 4": "00101001", "0 5": "000100111", "0 6": "000100110", "0 7": "000011010",
            "1 0": "111", "1 1": "101", "1 2": "0110", "1 3": "01001", "1 4": "0010111", "1 5": "0010000", "1 6": "00011010", "1 7": "00001011",
            "2 0": "10001", "2 1": "0111", "2 2": "01011", "2 3": "001110", "2 4": "0010101", "2 5": "00011110", "2 6": "0001010", "2 7": "00000111",
            "3 0": "010001", "3 1": "01010", "3 2": "001111", "3 3": "001100", "3 4": "0010010", "3 5": "00011100", "3 6": "00001110", "3 7": "00000101",
            "4 0": "0100000", "4 1": "001101", "4 2": "0010110", "4 3": "0010011", "4 4": "00010010", "4 5": "00010000", "4 6": "00001001", "4 7": "000000101",
            "5 0": "00101000", "5 1": "0010001", "5 2": "00011111", "5 3": "00011101", "5 4": "00010001", "5 5": "000001101", "5 6": "00000100", "5 7": "000000010",
            "6 0": "00011011", "6 1": "0001100", "6 2": "0001011", "6 3": "00001111", "6 4": "00001010", "6 5": "000000111", "6 6": "000000100", "6 7": "0000000001",
            "7 0": "000011011", "7 1": "00001100", "7 2": "00001000", "7 3": "000001100", "7 4": "000000110", "7 5": "000000011", "7 6": "000000001", "7 7": "0000000000"
        }
    },

    // Table 13
    {
        "maxvalue": 15,
        "linbits": 0,
        "table": {
            "0 0": "1", "0 1": "0101", "0 2": "001110", "0 3": "0010101", "0 4": "00100010", "0 5": "000110011", "0 6": "000101110", "0 7": "0001000111",
            "0 8": "000101010", "0 9": "0000110100", "0 10": "00001000100", "0 11": "00000110100", "0 12": "000001000011", "0 13": "000000101100", "0 14": "0000000101011", "0 15": "0000000010011",
            "1 0": "011", "1 1": "0100", "1 2": "001100", "1 3": "0010011", "1 4": "00011111", "1 5": "00011010", "1 6": "000101100", "1 7": "000100001",
            "1 8": "000011111", "1 9": "000011000", "1 10": "0000100000", "1 11": "0000011000", "1 12": "00000011111", "1 13": "000000100011", "1 14": "000000010110", "1 15": "000000001110",
            "2 0": "001111", "2 1": "001101", "2 2": "0010111", "2 3": "00100100", "2 4": "000111011", "2 5": "000110001", "2 6": "0001001101", "2 7": "0001000001",
            "2 8": "000011101", "2 9": "0000101000", "2 10": "0000011110", "2 11": "00000101000", "2 12": "00000011011", "2 13": "000000100001", "2 14": "0000000101010", "2 15": "0000000010000",
            "3 0": "0010110", "3 1": "0010100", "3 2": "00100101", "3 3": "000111101", "3 4": "000111000", "3 5": "0001001111", "3 6": "0001001001", "3 7": "0001000000",
            "3 8": "0000101011", "3 9": "00001001100", "3 10": "00000111000", "3 11": "00000100101", "3 12": "00000011010", "3 13": "000000011111", "3 14": "0000000011001", "3 15": "0000000001110",
            "4 0": "00100011", "4 1": "0010000", "4 2": "000111100", "4 3": "000111001", "4 4": "0001100001", "4 5": "0001001011", "4 6": "00001110010", "4 7": "00001011011",
            "4 8": "0000110110", "4 9": "00001001001", "4 10": "00000110111", "4 11": "000000101001", "4 12": "000000110000", "4 13": "0000000110101", "4 14": "0000000010111", "4 15": "00000000011000",
            "5 0": "000111010", "5 1": "00011011", "5 2": "000110010", "5 3": "0001100000", "5 4": "0001001100", "5 5": "0001000110", "5 6": "00001011101", "5 7": "00001010100",
            "5 8": "00001001101", "5 9": "00000111010", "5 10": "000001001111", "5 11": "00000011101", "5 12": "0000001001010", "5 13": "0000000110001", "5 14": "00000000101001", "5 15": "00000000010001",
            "6 0": "000101111", "6 1": "000101101", "6 2": "0001001110", "6 3": "0001001010", "6 4": "00001110011", "6 5": "00001011110", "6 6": "00001011010", "6 7": "00001001111",
            "6 8": "00001000101", "6 9": "000001010011", "6 10": "000001000111", "6 11": "000000110010", "6 12": "0000000111011", "6 13": "0000000100110", "6 14": "00000000100100", "6 15": "00000000001111",
            "7 0": "0001001000", "7 1": "000100010", "7 2": "0000111000", "7 3": "00001011111", "7 4": "00001011100", "7 5": "00001010101", "7 6": "000001011011", "7 7": "000001011010",
            "7 8": "000001010110", "7 9": "000001001001", "7 10": "0000001001101", "7 11": "0000001000001", "7 12": "0000000110011", "7 13": "00000000101100", "7 14": "0000000000101011", "7 15": "0000000000101010",
            "8 0": "000101011", "8 1": "00010100", "8 2": "000011110", "8 3": "0000101100", "8 4": "0000110111", "8 5": "00001001110", "8 6": "00001001000", "8 7": "000001010111",
            "8 8": "000001001110", "8 9": "000000111101", "8 10": "000000101110", "8 11": "0000000110110", "8 12": "0000000100101", "8 13": "00000000011110", "8 14": "000000000010100", "8 15": "000000000010000",
            "9 0": "0000110101", "9 1": "000011001", "9 2": "0000101001", "9 3": "0000100101", "9 4": "00000101100", "9 5": "00000111011", "9 6": "00000110110", "9 7": "0000001010001",
            "9 8": "000001000010", "9 9": "0000001001100", "9 10": "0000000111001", "9 11": "00000000110110", "9 12": "00000000100101", "9 13": "00000000010010", "9 14": "0000000000100111", "9 15": "000000000001011",
            "10 0": "0000100011", "10 1": "0000100001", "10 2": "0000011111", "10 3": "00000111001", "10 4": "00000101010", "10 5": "000001010010", "10 6": "000001001000", "10 7": "0000001010000",
            "10 8": "000000101111", "10 9": "0000000111010", "10 10": "00000000110111", "10 11": "0000000010101", "10 12": "00000000010110", "10 13": "000000000011010", "10 14": "0000000000100110", "10 15": "00000000000010110",
            "11 0": "00000110101", "11 1": "0000011001", "11 2": "0000010111", "11 3": "00000100110", "11 4": "000001000110", "11 5": "000000111100", "11 6": "000000110011", "11 7": "000000100100",
            "11 8": "0000000110111", "11 9": "0000000011010", "11 10": "0000000100010", "11 11": "00000000010111", "11 12": "000000000011011", "11 13": "000000000001110", "11 14": "000000000001001", "11 15": "0000000000000111",
            "12 0": "00000100010", "12 1": "00000100000", "12 2": "00000011100", "12 3": "000000100111", "12 4": "000000110001", "12 5": "0000001001011", "12 6": "000000011110", "12 7": "0000000110100",
            "12 8": "00000000110000", "12 9": "00000000101000", "12 10": "000000000110100", "12 11": "000000000011100", "12 12": "000000000010010", "12 13": "0000000000010001", "12 14": "0000000000001001", "12 15": "0000000000000101",
            "13 0": "000000101101", "13 1": "00000010101", "13 2": "000000100010", "13 3": "0000001000000", "13 4": "0000000111000", "13 5": "0000000110010", "13 6": "00000000110001", "13 7": "00000000101101",
            "13 8": "00000000011111", "13 9": "00000000010011", "13 10": "00000000001100", "13 11": "000000000001111", "13 12": "0000000000001010", "13 13": "000000000000111", "13 14": "0000000000000110", "13 15": "0000000000000011",
            "14 0": "0000000110000", "14 1": "000000010111", "14 2": "000000010100", "14 3": "0000000100111", "14 4": "0000000100100", "14 5": "0000000100011", "14 6": "000000000110101", "14 7": "00000000010101",
            "14 8": "00000000010000", "14 9": "00000000000010111", "14 10": "000000000001101", "14 11": "000000000001010", "14 12": "000000000000110", "14 13": "00000000000000001", "14 14": "0000000000000100", "14 15": "0000000000000010",
            "15 0": "000000010000", "15 1": "000000001111", "15 2": "0000000010001", "15 3": "00000000011011", "15 4": "00000000011001", "15 5": "00000000010100", "15 6": "000000000011101", "15 7": "00000000001011",
            "15 8": "000000000010001", "15 9": "000000000001100", "15 10": "0000000000010000", "15 11": "0000000000001000", "15 12": "0000000000000000001", "15 13": "000000000000000001", "15 14": "0000000000000000000", "15 15": "0000000000000001"
        }
    },

    // Table 14
    null,

    // Table 15
    {
        "maxvalue": 15,
        "linbits": 0,
        "table": {
            "0 0": "111", "0 1": "1100", "0 2": "10010", "0 3": "0110101", "0 4": "0101111", "0 5": "01001100", "0 6": "001111100", "0 7": "001101100",
            "0 8": "001011001", "0 9": "0001111011", "0 10": "0001101100", "0 11": "00001110111", "0 12": "00001101011", "0 13": "00001010001", "0 14": "000001111010", "0 15": "0000000111111",
            "1 0": "1101", "1 1": "101", "1 2": "10000", "1 3": "011011", "1 4": "0101110", "1 5": "0100100", "1 6": "00111101", "1 7": "00110011",
            "1 8": "00101010", "1 9": "001000110", "1 10": "000110100", "1 11": "0001010011", "1 12": "0001000001", "1 13": "0000101001", "1 14": "00000111011", "1 15": "00000100100",
            "2 0": "10011", "2 1": "10001", "2 2": "01111", "2 3": "011000", "2 4": "0101001", "2 5": "0100010", "2 6": "00111011", "2 7": "00110000",
            "2 8": "00101000", "2 9": "001000000", "2 10": "000110010", "2 11": "0001001110", "2 12": "0000111110", "2 13": "00001010000", "2 14": "00000111000", "2 15": "00000100001",
            "3 0": "011101", "3 1": "011100", "3 2": "011001", "3 3": "0101011", "3 4": "0100111", "3 5": "00111111", "3 6": "00110111", "3 7": "001011101",
            "3 8": "001001100", "3 9": "000111011", "3 10": "0001011101", "3 11": "0001001000", "3 12": "0000110110", "3 13": "00001001011", "3 14": "00000110010", "3 15": "00000011101",
            "4 0": "0110100", "4 1": "010110", "4 2": "0101010", "4 3": "0101000", "4 4": "01000011", "4 5": "00111001", "4 6": "001011111", "4 7": "001001111",
            "4 8": "001001000", "4 9": "000111001", "4 10": "0001011001", "4 11": "0001000101", "4 12": "0000110001", "4 13": "00001000010", "4 14": "00000101110", "4 15": "00000011011",
            "5 0": "01001101", "5 1": "0100101", "5 2": "0100011", "5 3": "01000010", "5 4": "00111010", "5 5": "00110100", "5 6": "001011011", "5 7": "001001010",
            "5 8": "000111110", "5 9": "000110000", "5 10": "0001001111", "5 11": "0000111111", "5 12": "00001011010", "5 13": "00000111110", "5 14": "00000101000", "5 15": "000000100110",
            "6 0": "001111101", "6 1": "0100000", "6 2": "00111100", "6 3": "00111000", "6 4": "00110010", "6 5": "001011100", "6 6": "001001110", "6 7": "001000001",
            "6 8": "000110111", "6 9": "0001010111", "6 10": "0001000111", "6 11": "0000110011", "6 12": "00001001001", "6 13": "00000110011", "6 14": "000001000110", "6 15": "000000011110",
            "7 0": "001101101", "7 1": "00110101", "7 2": "00110001", "7 3": "001011110", "7 4": "001011000", "7 5": "001001011", "7 6": "001000010", "7 7": "0001111010",
            "7 8": "0001011011", "7 9": "0001001001", "7 10": "0000111000", "7 11": "0000101010", "7 12": "00001000000", "7 13": "00000101100", "7 14": "00000010101", "7 15": "000000011001",
            "8 0": "001011010", "8 1": "00101011", "8 2": "00101001", "8 3": "001001101", "8 4": "001001001", "8 5": "000111111", "8 6": "000111000", "8 7": "0001011100",
            "8 8": "0001001101", "8 9": "0001000010", "8 10": "0000101111", "8 11": "00001000011", "8 12": "00000110000", "8 13": "000000110101", "8 14": "000000100100", "8 15": "000000010100",
            "9 0": "001000111", "9 1": "00100010", "9 2": "001000011", "9 3": "000111100", "9 4": "000111010", "9 5": "000110001", "9 6": "0001011000", "9 7": "0001001100",
            "9 8": "0001000011", "9 9": "00001101010", "9 10": "00001000111", "9 11": "00000110110", "9 12": "00000100110", "9 13": "000000100111", "9 14": "000000010111", "9 15": "000000001111",
            "10 0": "0001101101", "10 1": "000110101", "10 2": "000110011", "10 3": "000101111", "10 4": "0001011010", "10 5": "0001010010", "10 6": "0000111010", "10 7": "0000111001",
            "10 8": "0000110000", "10 9": "00001001000", "10 10": "00000111001", "10 11": "00000101001", "10 12": "00000010111", "10 13": "000000011011", "10 14": "0000000111110", "10 15": "000000001001",
            "11 0": "0001010110", "11 1": "000101010", "11 2": "000101000", "11 3": "000100101", "11 4": "0001000110", "11 5": "0001000000", "11 6": "0000110100", "11 7": "0000101011",
            "11 8": "00001000110", "11 9": "00000110111", "11 10": "00000101010", "11 11": "00000011001", "11 12": "000000011101", "11 13": "000000010010", "11 14": "000000001011", "11 15": "0000000001011",
            "12 0": "00001110110", "12 1": "0001000100", "12 2": "000011110", "12 3": "0000110111", "12 4": "0000110010", "12 5": "0000101110", "12 6": "00001001010", "12 7": "00001000001",
            "12 8": "00000110001", "12 9": "00000100111", "12 10": "00000011000", "12 11": "00000010000", "12 12": "000000010110", "12 13": "000000001101", "12 14": "0000000001110", "12 15": "0000000000111",
            "13 0": "00001011011", "13 1": "0000101100", "13 2": "0000100111", "13 3": "0000100110", "13 4": "0000100010", "13 5": "00000111111", "13 6": "00000110100", "13 7": "00000101101",
            "13 8": "00000011111", "13 9": "000000110100", "13 10": "000000011100", "13 11": "000000010011", "13 12": "000000001110", "13 13": "000000001000", "13 14": "0000000001001", "13 15": "0000000000011",
            "14 0": "000001111011", "14 1": "00000111100", "14 2": "00000111010", "14 3": "00000110101", "14 4": "00000101111", "14 5": "00000101011", "14 6": "00000100000", "14 7": "00000010110",
            "14 8": "000000100101", "14 9": "000000011000", "14 10": "000000010001", "14 11": "000000001100", "14 12": "0000000001111", "14 13": "0000000001010", "14 14": "000000000010", "14 15": "0000000000001",
            "15 0": "000001000111", "15 1": "00000100101", "15 2": "00000100010", "15 3": "00000011110", "15 4": "00000011100", "15 5": "00000010100", "15 6": "00000010001", "15 7": "000000011010",
            "15 8": "000000010101", "15 9": "000000010000", "15 10": "000000001010", "15 11": "000000000110", "15 12": "0000000001000", "15 13": "0000000000110", "15 14": "0000000000010", "15 15": "0000000000000"
        }
    },

    // Table 16
    {
        "maxvalue": 16,
        "linbits": 1,
        "table": HuffmanTable16
    },

    // Table 17
    {
        "maxvalue": 18,
        "linbits": 2,
        "table": HuffmanTable16
    },

    // Table 18
    {
        "maxvalue": 22,
        "linbits": 3,
        "table": HuffmanTable16
    },

    // Table 19
    {
        "maxvalue": 30,
        "linbits": 4,
        "table": HuffmanTable16
    },

    // Table 20
    {
        "maxvalue": 78,
        "linbits": 6,
        "table": HuffmanTable16
    },

    // Table 21
    {
        "maxvalue": 270,
        "linbits": 8,
        "table": HuffmanTable16
    },

    // Table 22
    {
        "maxvalue": 1038,
        "linbits": 10,
        "table": HuffmanTable16
    },

    // Table 23
    {
        "maxvalue": 8206,
        "linbits": 13,
        "table": HuffmanTable16
    },

    // Table 24
    {
        "maxvalue": 30,
        "linbits": 4,
        "table": HuffmanTable24
    },

    // Table 25
    {
        "maxvalue": 46,
        "linbits": 5,
        "table": HuffmanTable24
    },

    // Table 26
    {
        "maxvalue": 78,
        "linbits": 6,
        "table": HuffmanTable24
    },

    // Table 27
    {
        "maxvalue": 142,
        "linbits": 7,
        "table": HuffmanTable24
    },

    // Table 28
    {
        "maxvalue": 270,
        "linbits": 8,
        "table": HuffmanTable24
    },

    // Table 29
    {
        "maxvalue": 526,
        "linbits": 9,
        "table": HuffmanTable24
    },

    // Table 30
    {
        "maxvalue": 2062,
        "linbits": 11,
        "table": HuffmanTable24
    },

    // Table 31
    {
        "maxvalue": 8206,
        "linbits": 13,
        "table": HuffmanTable24
    }
];



/**
 * 注：可用以下代码格式化
 * 
const str = `
0 0 1 1
0 1 3 010
0 2 6 000001
1 0 3 011
1 1 3 001
1 2 5 00001
...
`;
let buffer = new Array();
let lines = str.split("\n");

let prevX = 0;
for(let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if(line.length <= 0) continue;
    let fields = line.split(/\s+/gi);
    let crlf = (fields[1] === "15" || fields[1] === "7") ? "\n" : " ";
    let newline = `"${fields[0]} ${fields[1]}": "${fields[3]}",${crlf}`;
    buffer.push(newline);
}
console.log(buffer.join(""));
 */


/**
 * @description 哈夫曼树
 */

function HuffmanTree() {
    this.isEnd = false;
    this.nexts = new Array();
    return this;
}

HuffmanTree.prototype.AddCode = function(bincode, key) {
    let currentTree = this;
    for(let i = 0; i < bincode.length; i++) {
        let currentBit = (bincode[i] === "0") ? 0 : 1;
        let nextTree = currentTree.nexts[currentBit];
        if(!nextTree) {
            nextTree = new HuffmanTree();
            currentTree.nexts[currentBit] = nextTree;
        }
        currentTree = nextTree;

        if(i === bincode.length - 1) {
            currentTree.key = key;
            currentTree.isEnd = true;
        }
    }
    return this;
};

HuffmanTree.prototype.Decode = function(str) {
    let currentTree = this;
    for(let i = 0; i < str.length; i++) {
        let bit = (str[i] === "0") ? 0 : 1;
        currentTree = currentTree.nexts[bit];
        if(currentTree.isEnd === true) {
            return {
                key: currentTree.key,
                runlength: i+1
            };
        }
    }
    return null;
}


/**
 * @description 初始化哈夫曼树
 */
function HuffmanTreeInit() {
    let HuffmanTreeDuple = new Array();
    let HuffmanTreeQuadruple = new Array();
    // 大值表
    for(let i = 0; i < HuffmanTableDuple.length; i++) {
        if(HuffmanTableDuple[i] === null) continue;
        let htree = new HuffmanTree();
        let htable = HuffmanTableDuple[i].table;
        for(let key in htable) {
            let hcode = htable[key];
            htree.AddCode(hcode, key);
        }
        HuffmanTreeDuple[i] = htree;
    }
    // 小值表
    let htree0 = new HuffmanTree();
    let htree1 = new HuffmanTree();
    for(let i = 0; i < 16; i++) {
        let key = BinaryString(i, 4).split("").join(" ");
        let hcode0 = HuffmanTableQuadruple[0][i];
        let hcode1 = HuffmanTableQuadruple[1][i];
        htree0.AddCode(hcode0, key);
        htree1.AddCode(hcode1, key);
    }
    HuffmanTreeQuadruple[0] = htree0;
    HuffmanTreeQuadruple[1] = htree1;

    return {
        HuffmanTreeQuadruple: HuffmanTreeQuadruple,
        HuffmanTreeDuple: HuffmanTreeDuple
    };
}

/**
 * @description 使用选定的哈夫曼树解码字符串（仅匹配前缀）
 */
function DecodePrefix(str, htree) {
    let hresult = htree.Decode(str)
    let key = hresult.key.split(" ");
    if(key.length === 2) {
        return {
            runlength: hresult.runlength,
            x: parseInt(key[0]),
            y: parseInt(key[1])
        };
    }
    else if(key.length === 4) {
        return {
            runlength: hresult.runlength,
            v: parseInt(key[0]),
            w: parseInt(key[1]),
            x: parseInt(key[2]),
            y: parseInt(key[3])
        };
    }
}

// let htrees = HuffmanTreeInit();
// let res = DecodePrefix("00010000000000000000", htrees.HuffmanTreeDuple[15]);
// console.log(res);
