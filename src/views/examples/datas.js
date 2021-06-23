export const AddForm = {
    provinceId: "", // 省id
    provinceName: "",//省名称
    cityId: "", // 市id
    cityName: "",//市名称
    countryId: "", // 区id
    countryName: "",//区名称
    subFullName: "", // 小区名称
    subAddress: "",//小区地址
}

export const AddRules = {
    provinceId: [
        { required: true, message: "请选择省", trigger: "change" },
    ],
    cityId: [
        { required: true, message: "请选择市", trigger: "change" },
    ],
    countryId: [
        { required: true, message: "请选择区", trigger: "change" },
    ],
    subFullName: [
        { required: true, message: "请填写小区名称", trigger: "blur" },
    ],
    subAddress: [
        { required: true, message: "请填写小区地址", trigger: "blur" },
    ],
}