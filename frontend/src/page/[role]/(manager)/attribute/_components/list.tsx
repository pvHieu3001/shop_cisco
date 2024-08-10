import { Card, Col, Flex, Popconfirm, Row, Select } from "antd";
import { Button, Form, Input, message, Space } from 'antd';

import { Typography } from 'antd';
import { Table, Tag } from 'antd';

const { Column, ColumnGroup } = Table;

import type { TableColumnsType, TableProps } from 'antd';
import CategoryAttribute from "./category_attribute/List";
import Attribute from "./attribute/list";
import ValueAttribute from "./value_attribute/list";
import { useDeleteAttributeMutation, useGetAttributesQuery } from "./attribute/AttributeEndpoints";
import { popupError, popupSuccess } from "@/page/[role]/shared/Toast";
import { IAttribute } from "@/common/types/attribute.interface";
import { Link } from "react-router-dom";



export default function ListAttribute() {

  const { data, isLoading } = useGetAttributesQuery({});
  const [deleteAttribute, { isLoading: isLoadingDeleteAttribute }] = useDeleteAttributeMutation();
  const confirm = async (id: number | string) => {
    try {
      await deleteAttribute(id).unwrap();
      popupSuccess('Delete attribute success');
    } catch (error) {
      popupError('Delete attribute error');
    }
  };

  const columns: TableProps<IAttribute>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: '5%',
      render: (_: any, __: IAttribute, index: number) => {
        return index + 1;
      },
    },
    {
      title: 'Tên thuộc tính',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, item: IAttribute) => {
        return item.name;
      },
    },

    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Flex wrap="wrap" gap="small">
          <Link to={String(record.id)} ><Button type="primary" >
            Sửa
          </Button></Link>
          <Popconfirm
                    disabled={isLoadingDeleteAttribute}
                    title="Delete the user"
                    description={`Are you sure to delete "${record.name}" ?`}
                    onConfirm={() => confirm(String(record.id))}
                    okText="Yes"
                    cancelText="No">
                    <Button danger loading={isLoadingDeleteAttribute} >Xóa</Button>
                  </Popconfirm>
        </Flex>
      ),
    },
  ];

  const dataItem = data?.map((item : IAttribute, key : number) => {
    return {
      ...item,
      key : key
    }
  })


  return <>
    <Typography.Title editable level={2} style={{ margin: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        Danh sách thuộc tính <Flex wrap="wrap" gap="small">
         
         <Link to="add">  <Button type="primary" danger >
            Thêm thuộc tính
          </Button></Link>
         
        </Flex>
      </div>

    </Typography.Title>

    <Table columns={columns} dataSource={dataItem} loading={isLoading} />
  </>
}