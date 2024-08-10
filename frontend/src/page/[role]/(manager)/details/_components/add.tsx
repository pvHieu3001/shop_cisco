import { useEffect, useState } from "react";
import { useCreateDetailMutation, useGetDetailsQuery } from "./DetailsEndpoints";
import { popupError, popupSuccess } from "@/page/[role]/shared/Toast";
import { useNavigate } from "react-router-dom";
import ErrorLoad from "../../components/util/ErrorLoad";
import { Button, Form, Input, Modal, Select } from "antd";
import { IDetail } from "@/common/types/product.interface";


const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
}

export default function AddDetail(){
    const [createDetail, { isLoading: isLoadingCreateDetail, isError }] = useCreateDetailMutation();
    const {data : details, isLoading } = useGetDetailsQuery();
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

     const onFinish = async (values: IDetail | any) => {
        const formData = new FormData()

        formData.append('name', values.name);
        formData.append('detail_id', values.detail_id)

        try {
            await createDetail(formData).unwrap();
            popupSuccess('Create detail success');
            handleCancel();
        } catch (error) {
            popupError('Create detail error');
        }
    }

    const navigate = useNavigate()

    const handleCancel = () => {
        navigate('..')
    }

    if (isError) return <ErrorLoad />
    return (
        <>
            <Modal okButtonProps={{ hidden: true }} title='Thêm chi tiết' open={true} onCancel={handleCancel}>
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
                        <Input type='text' placeholder='Nhập tên chi tiết' />
                    </Form.Item>

                    <Form.Item name='detail_id' label='Detail' rules={[{ required: true }]}>
                    <Select
                        style={{ width: '100%' }}
                        options={optionDetails}
                    />
                    </Form.Item>

                    <Form.Item>
                        <Button loading={isLoadingCreateDetail} disabled={isLoadingCreateDetail} type='primary' htmlType='submit'>
                            Tạo
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )


}