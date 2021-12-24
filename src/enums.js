const ClientTypeEnum = Object.freeze({
    SOLE_PROPRIETOR: 1,
    LTD: 2,
})

const AccountTypeEnum = Object.freeze({
    CARD: 1,
    STANDARD: 2
})

const ForeignCurrencyEnum = Object.freeze({
    USD: "usd",
    EUR: "eur",
    RUB: "rub",
    GBP: "gbp",
})

const PurposeTypeEnum = Object.freeze({
    openDeposit: "დეპოზიტის გახსნა",
    loan: "სესხი",
    personalOperations: "პირადი ოპერაციების განხორციელება",
    settlementOperations: "ანგარიშსწორების ოპერაციებისთვის",
    takePayrollCard: "სახელფასო ბარათის აღება",
})

const ExpectedOperationTypeEnum = Object.freeze({
    enrollmentTransfersNationalCurrency: "ჩარიცხვა/გადარიცხვები ეროვნულ ვალუტაში",
    enrollmentTransfersForeignCurrency: "ჩარიცხვა/გადარიცხვები უცხოურ ვალუტაში",
    cashOperationsAccount: "ანგარიშზე ნაღდი ოპერაციები",
    operationsUsingCard: "ოპერაციები ბარათის გამოყენებით",
    depositRelatedOperations: "დეპოზიტებთან დაკავშირებული ოპერაციები",
})

const OtherBankEnum = Object.freeze({
    tbcBank: "თიბისი ბანკი",
    georgianBank: "საქართველოს ბანკი",
    proCredetBank: "პროკრედიტ ბანკი",
    libertyBank: "ლიბერთი ბანკი",
    basisBank: "ბაზის ბანკი",
})

export {
    ClientTypeEnum,
    AccountTypeEnum,
    ForeignCurrencyEnum,
    PurposeTypeEnum,
    ExpectedOperationTypeEnum,
    OtherBankEnum,
};