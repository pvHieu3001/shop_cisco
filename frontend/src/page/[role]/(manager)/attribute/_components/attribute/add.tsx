import { IAttribute } from "@/common/types/attribute.interface";
import { useCreateAttributeMutation, useGetAttributesQuery } from "./AttributeEndpoints";
import { useNavigate } from 'react-router-dom'
import { popupError, popupSuccess } from "@/page/[role]/shared/Toast";
import { Button, Form, Input, Modal, Select } from "antd";
import ErrorLoad from "../../../components/util/ErrorLoad";
import { useEffect, useState } from "react";


const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
}


export default function AddAttribute() {
    const [createAttribute, { isLoading: isLoadingCreateAttribute, isError }] = useCreateAttributeMutation();
    const {data : details, isLoading } = useGetAttributesQuery();
    const [optionDetails, setOptionDetails] = useState([]);

    const [form] = Form.useForm();

    useEffect(() => {
        if(details){
            var options = details?.map((item : {id : number, name : string}) => {
                return {
                    value : item.id,
                    label : item.name
                }
            });
            setOptionDetails(options);
        }
        
     }, [details])

    const onFinish = async (values: IAttribute | any) => {
        const formData = new FormData()

        formData.append('name', values.name);
        formData.append('detail_id', values.detail_id)

        try {
            await createAttribute(formData).unwrap();
            popupSuccess('Create attribute success');
            handleCancel();
        } catch (error) {
            popupError('Create attribute error');
        }
    }

    const navigate = useNavigate()

    const handleCancel = () => {
        navigate('..')
    }

    if (isError) return <ErrorLoad />
    return (
        <>
            <Modal okButtonProps={{ hidden: true }} title='Thêm thuộc tính' open={true} onCancel={handleCancel}>
                <Form
                    layout="vertical"
                    form={form}
                    {...layout}
                    name='nest-messages'
                    onFinish={onFinish}
                    style={{ maxWidth: 600 }}
                //validateMessages={validateMessages}
                >
                    <Form.Item name='name' label='Tên' rules={[{ required: true }]}>
                        <Input type='text' placeholder='Nhập tên thuộc tính' />
                    </Form.Item>

                    <Form.Item name='detail_id' label='Detail' rules={[{ required: true }]}>
                    <Select
                        style={{ width: '100%' }}
                        options={optionDetails}
                    />
                    </Form.Item>

                    <Form.Item>
                        <Button loading={isLoadingCreateAttribute} disabled={isLoadingCreateAttribute} type='primary' htmlType='submit'>
                            Tạo
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
