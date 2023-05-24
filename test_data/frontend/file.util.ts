import { Injectable } from '@angular/core';

@Injectable()
export class FileUtil {

    constructor() {}

    isCSVFile(file) {
        return file.name.endsWith('.csv');
    }

    getHeaderArray(csvRecordsArr, tokenDelimeter) {
        const headers = csvRecordsArr[0].split(tokenDelimeter);
        const headerArray = [];
        for (let j = 0; j < headers.length; j++) {
            headerArray.push(headers[j]);
        }
        return headerArray;
    }

    validateHeaders(origHeaders, fileHeaaders) {
        if (origHeaders.length !== fileHeaaders.length) {
            return false;
        }

        let fileHeaderMatchFlag = true;
        for (let j = 0; j < origHeaders.length; j++) {
            if (origHeaders[j] !== fileHeaaders[j]) {
                fileHeaderMatchFlag = false;
                break;
            }
        }
        return fileHeaderMatchFlag;
    }

    getDataRecordsArrayFromCSVFile(csvRecordsArray, headerLength,
        validateHeaderAndRecordLengthFlag, tokenDelimeter) {
        const dataArr = [];
        for (let i = 0; i < csvRecordsArray.length; i++) {
            const data = csvRecordsArray[i].split(tokenDelimeter);
            if (validateHeaderAndRecordLengthFlag && data.length !== headerLength) {
                if (data === '') {
                    alert('Extra blank line is present at line number ' + i + ', please remove it.');
                    return null;
                } else {
                    alert('Record at line number ' + i + ' contain ' + data.length +
                      ' tokens, and is not matching with header length of :' + headerLength);
                    return null;
                }
            }

            const col = [];
            for (let j = 0; j < data.length; j++) {
              col.push(data[j].replace(/"/g, ''));
            }
            dataArr.push(col);
        }
        return dataArr;
    }

}
