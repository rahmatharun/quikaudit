const storage = window.localStorage;

export const getData = async (item, dir) => {
    dir = dir ? dir + "_" : "";
    dir = dir + item;
    return new Promise((resolve, reject) => {
        let data = storage.getItem(dir)

        if (typeof data == "undefined"||!data) {
            reject( new Error('Data not exists'));
        }
        else {
            resolve(JSON.parse(data))
        }
    });

}

export const setData = async (item, data, dir) => {
    dir = dir ? dir + "_" : "";
    dir = dir + item;
    return new Promise((resolve, reject) => {
        try {
            storage.setItem(dir, JSON.stringify(data));
            resolve(true)
        }
        catch (e) { reject( e); }

    });

}