import { parse } from '@/common/util';
import User from '@/models/user.model';
import { readFileSync } from 'fs';
import _ from 'lodash';

import path from 'path';

export const translateUserData = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: 1 } });
        const translatedUser = {};
        for (const key in parse(user)) {
            translatedUser[key] = user[key];
        }
        req.translatedUser = translatedUser;
        next();
    } catch (err) {
        res.status(500).send('Error fetching and translating user data');
    }
};

export async function translateJson(jsonData, targetLanguage, fieldToConvert: string[]) {
    // Start the translation process

    const translate = await getTranslateAuthClient();
    const allStrings = [];
    const stringMap = new Map();

    // Function to collect all strings
    function collectStrings(obj) {
        if (typeof obj === 'string') {
            if (!stringMap.has(obj)) {
                stringMap.set(obj, null);
                allStrings.push(obj);
            }
        } else if (Array.isArray(obj)) {
            obj.forEach((item) => collectStrings(item));
        } else if (obj !== null && typeof obj === 'object') {
            Object.values(obj).forEach((value) => collectStrings(value));
        }
    }

    if (!_.isEmpty(fieldToConvert)) {
        for (const key in jsonData) {
            if (fieldToConvert.includes(key)) {
                if (jsonData.hasOwnProperty(key)) {
                    collectStrings(jsonData[key]);
                }
            }
        }
    } else {
        for (const key in jsonData) {
            if (!['status'].includes(key)) {
                if (jsonData.hasOwnProperty(key)) {
                    collectStrings(jsonData[key]);
                }
            }
        }
    }

    // Batch translate all collected strings
    const translations = await batchTranslate(translate, allStrings, targetLanguage);
    // Map translations back to the original strings
    allStrings.forEach((str, idx) => stringMap.set(str, translations[idx]));

    // Function to reconstruct the object with translated strings
    function reconstructObject(obj) {
        if (typeof obj === 'string') {
            return stringMap.get(obj);
        } else if (Array.isArray(obj)) {
            return obj.map((item) => reconstructObject(item));
        } else if (obj !== null && typeof obj === 'object') {
            const newObj = {};
            for (const [key, value] of Object.entries(obj)) {
                const translateData = reconstructObject(value);
                newObj[key] = translateData ? translateData : value;
            }
            return newObj;
        } else {
            return obj;
        }
    }

    // Reconstruct the original object with translated strings
    return reconstructObject(jsonData);
}

// export async function getTranslateAuthClient() {
//     // Replace 'YOUR_PROJECT_ID' and 'YOUR_API_KEY' with your actual Google Cloud project ID and API key.
//     const keyFilePath = path.join(GOOGLE_APPLICATION_CREDENTIALS);

//     const credentials = JSON.parse(readFileSync(keyFilePath, 'utf8'));
//     const authClient = new google.auth.JWT(
//         credentials.client_email,
//         null,
//         credentials.private_key,
//         ['https://www.googleapis.com/auth/cloud-translation', 'https://www.googleapis.com/auth/cloud-platform'],
//         'carolina.boarini@proleven.com',
//     );

//     await new Promise((reslove, reject) => {
//         authClient.authorize((err, _tokens) => {
//             if (err) {
//                 reject(`Error authorizing JWT client:, ${err}`);
//                 console.error('Error authorizing JWT client:', err);
//                 return;
//             }
//             reslove(authClient);
//         });
//     });
//     const translate = google.translate({ version: 'v2', auth: authClient });
//     return translate;
// }

async function batchTranslate(translate, texts, targetLanguage) {
    if (targetLanguage === 'italian') targetLanguage = 'it';
    if (texts && !_.isEmpty(texts)) {
        try {
            const res = await translate.translations.list({
                format: 'text',
                q: texts,
                source: 'en',
                target: targetLanguage,
            });

            return res.data?.data.translations.map((translation) => translation.translatedText);
        } catch (error) {
            return texts;
        }
    }
    return texts;
}
