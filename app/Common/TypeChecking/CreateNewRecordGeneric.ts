import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";

type DbTransactionOptions = {
    useTransaction: true,
    dbTransaction: TransactionClientContract
} | {useTransaction: false}

 type CreateNewRecordGeneric<RecordPayload> = {
    createPayload: RecordPayload,
    dbTransactionOptions: DbTransactionOptions
}

export default CreateNewRecordGeneric;