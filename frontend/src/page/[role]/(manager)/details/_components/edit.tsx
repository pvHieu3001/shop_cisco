import { IDetail } from "@/common/types/product.interface";
import { useGetDetailQuery, useUpdateDetailMutation } from "./DetailsEndpoints";
import { Button, Form, Input, Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import LoadingUser from "../../user/util/Loading";
import ErrorLoad from "../../components/util/ErrorLoad";
import { popupSuccess } from "@/page/[role]/shared/Toast";

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
}

const validateMessages = {
    required: '${label} là bắt buộc!',
    // types: {
    //   email: '${label} không phải là một email hợp lệ!',
    //   number: '${label} không phải là một số điện thoại hợp lệ!'
    // },
    // number: {
    //   range: '${label} phải ở giữa ${min} và ${max}'
    // }
}

export default function EditDetail() {
    const param = useParams();
    const [file, setFile] = useState({
        data: {},
        loading: false
    })

    const { data: dataItem, isLoading: dataLoading, isError: isErrorDataItem } = useGetDetailQuery(param.id)
    const [uploadDetail, { isLoading: isLoadingUploadDetail }] = useUpdateDetailMutation();

    // const handleUpload = async (options: any) => {
    //     const { onSuccess, file } = options
    //     setFile({
    //         data: file,
    //         loading: false
    //     })
    //     onSuccess('Upload successful', file)
    // }


    const [form] = Form.useForm()

    const onFinish = async (values: IDetail | any) => {



        setFile((prev) => {
            return {
                ...prev,
                loading: true
            }
        })
        const formData = new FormData()


        formData.append('name', values.name)
        if (values.upload) {
            formData.append('logo', values.upload[0].originFileObj)
        }
        try {
            const payload = {
                id: param.id,
                data: formData
            }
            await uploadDetail(payload).unwrap();
            handleCancel();
            popupSuccess('Updated detail')
        } catch (error) {
            popupSuccess('Updated detail error')
        }

    }

    const navigate = useNavigate()

    const handleCancel = () => {
        navigate('..')
    }

    if (dataLoading) return <LoadingUser />
    if (isErrorDataItem) return <ErrorLoad />
    return (
        <>
            <Modal okButtonProps={{ hidden: true }} title='Edit detail' open={true} onCancel={handleCancel}>
                <Form
                    initialValues={dataItem?.data}
                    layout="vertical"
                    form={form}
                    {...layout}
                    name='nest-messages'
                    onFinish={onFinish}
                    style={{ maxWidth: 600 }}
                    validateMessages={validateMessages}
                >
                    <Form.Item name='name' label='Name' rules={[{ required: true }]}>
                        <Input type='text' placeholder='Nhập tên chi tiết' />
                    </Form.Item>

                    <Form.Item className='mt-4'>
                        <Button loading={isLoadingUploadDetail} disabled={isLoadingUploadDetail} type='primary' htmlType='submit'>
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )

}

