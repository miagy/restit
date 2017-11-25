import isString from 'lodash/isString'
import isObject from 'lodash/isObject'
import isFunction from 'lodash/isFunction'
import cloneDeep from 'lodash/cloneDeep'
import get from 'lodash/get'
import merge from 'lodash/merge'

const STORAGE_TYPES = {
  'LOCAL_STORAGE': 'storage',
  'SESSION_STORAGE': 'sessionStorage',
  'COOKIE': 'cookie'
}

export const canUseStorage = (storageType, storage) => {
    let testKey = 'test'
    let _storage = new Storage(storageType, storage)
    try
    {
        _storage.setValue(testKey, '1');
        _storage.removeValue(testKey);
        return true
    }
    catch (error)
    {
        return false;
    }
}

/**
 * The storages map that implements the WebStorage
 * @type {Object}
 */
export const STORAGES_MAP = {
    storage: {
        setValue: (propertyName, value, storage) => {
            storage.setItem(propertyName, JSON.stringify(value))
        },
        getValue: (propertyName, storage) => {
            return storage.getItem(propertyName)
        },
        removeValue: (propertyName, storage) => {
            storage.removeItem(propertyName)
        }
    },
    cookie: {
        setValue: (propertyName, propertyValue, cookieExpiringDate, storage) => {
            storage.save(propertyName, propertyValue, {
                path: '/',
                expires: cookieExpiringDate
            });
        },
        getValue: (propertyName, cookieExpiringDate, storage) => {
            return storage.load(propertyName, {
                path: '/',
                expires: cookieExpiringDate
            });
        },
        removeValue: (propertyName, cookieExpiringDate, storage) => {
            storage.removeValue(propertyName, {
                path: '/',
                expires: cookieExpiringDate
            });
        }
    }
}

/**
 * Build a custom storage object
 * @param  {string} type          The type of storage; i.e: tvFileSystem
 * @param  {Function} setValue    The function to set value in the storage
 * @param  {Function} getValue    The function to get value in the storage
 * @param  {Function} removeValue The function to remove value in the storage
 * @return {Object}               The custom storage map
 */
export const buildCustomStorage = (type, setValue, getValue, removeValue) => {
  let _storage = {}
  _storage[type] = {
    setValue: setValue,
    getValue: getValue,
    removeValue: removeValue
  }
  return _storage
}

/**
 * Build new Storages Map adding custom storages
 * @param  {string} storageType The type of storage; i.e: tvFileSystem
 * @param  {Object} storage     The new storage object
 * @return {Object}             The new storages map
 */
export const buildCustomStoragesMap = (storageType, storage) => {
    if (STORAGES_MAP[storageType] !== undefined){
      console.warn('storageType is already defined! Its value will be overwrited!')
    }
    let _storageMap = cloneDeep(STORAGES_MAP)
    let _storage = cloneDeep(storage)
    merge(_storageMap, _storage)
    return _storageMap
}
/**
 * This is a simple interface for WebStorages
 * @type {[type]}
 */
class Storage {
    constructor(storageType, storage, storagesMap) {
        this.STORAGE_TYPE = storageType
        this.STORAGE = cloneDeep(storage) || cloneDeep(storagesMap[storageType])
        this.STORAGES_MAP = cloneDeep(storagesMap) || cloneDeep(STORAGES_MAP)
    }

    static getTypesMap(){
      return STORAGE_TYPES
    }
    getCookieExp() {
        var now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
    }

    getType() {
        return this.STORAGE_TYPE
    }

    getMethod() {
        return this.STORAGE
    }

    setValue(propertyName, propertyValue, cookieExpDate) {
        this.STORAGES_MAP[this.STORAGE_TYPE].setValue(propertyName, propertyValue, cookieExpDate || this.getCookieExp(), this.STORAGE)
    }

    getValue(propertyName, cookieExpDate) {
        return this.STORAGES_MAP[this.STORAGE_TYPE].getValue(propertyName, cookieExpDate || this.getCookieExp(), this.STORAGE)
    }

    removeValue(propertyName, cookieExpDate) {
        this.STORAGES_MAP[this.STORAGE_TYPE].removeValue(propertyName, cookieExpDate || this.getCookieExp(), this.STORAGE)
    }
}

export default Storage
