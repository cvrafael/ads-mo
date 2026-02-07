import { Table, Select, Button, Popover, Flex } from 'antd';
import { useEffect, useState } from 'react';
import {getAllRunins} from './apiTEMaintenance';
import { WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';

const TEMaintenance = () => {
  const [runins, setRunins] = useState([]);
  const [tableData, setTableData] = useState([]);

useEffect(() => {
  getAllRunins()
    .then((result) => {
      const rows = result.data.map((r) => ({
        key: r.id,
        runin: r.runin,
        racks: r.racks,
        rack: null,
        position: null,
      }));

      setTableData(rows);
    })
    .catch(console.error);
}, []);

const actionColumn = (_, record) => (
  <Button
    type="primary"
    danger
    disabled={!record.rack || !record.position}
    onClick={() => {
      const payload = {
        runin: record.runin,
        rack: record.rack,
        position: record.position,
      };

      console.log('payload:', payload);

      // futuro:
      // api.patch('/maintenance/status', payload)
    }}
  >
    Solid
  </Button>
);

const rackColumn = (_, record) =>{
  const content = (
  <div>
    <p>Existe racks com problemas</p>
  </div>
);
  const content2 = (
  <div>
    <p>Runin sem problemas</p>
  </div>
);
  const hasAnyRackNok = record.racks.some((rk) =>
  rk.positions.some((p) => p.status === 'NOK')
);
console.log(record.racks)
  return (
  <Flex gap={5}>
  <Select
    placeholder="Select rack"
    value={record.rack}
    style={{ width: '100%' }}
    options={record.racks.map((rk) => {
      const hasNokRack = rk.positions.some(
        (p) => p.status === 'NOK'
      );

      return {
        value: rk.rack,
        label: (
          <span
            style={{
              color: hasNokRack ? 'red' : 'inherit',
              fontWeight: hasNokRack ? 'bold' : 'normal',
            }}
          >
            {rk.rack}
          </span>
        ),
      };
    })}
    onChange={(value) => {
      setTableData((prev) =>
        prev.map((row) =>
          row.key === record.key
            ? { ...row, rack: value, position: null }
            : row
        )
      );
    }}
  />

  {hasAnyRackNok ? (
     <Popover content={content} trigger="hover">
      
    <Button
      icon={<WarningOutlined />}
      type="primary"
      danger
      />
      </Popover>
  ) : (
    <Popover content={content2} trigger="hover">

    <Button
      icon={<CheckCircleOutlined />}
      type="primary"
      style={{ background: '#52c41a', borderColor: '#52c41a' }}
      />
      </Popover>
  )}
</Flex>
)};


const positionColumn = (_, record) => {
  const rackSelected = record.racks.find(
    (rk) => rk.rack === record.rack
  );

  const options =
    rackSelected?.positions.map((p) => ({
      value: p.position,
      label: (
        <span style={{ color: p.status === 'NOK' ? 'red' : 'inherit' }}>
          {p.position}
        </span>
      ),
    })) || [];

  return (
    <Select
      placeholder="Select position"
      value={record.position}
      disabled={!record.rack}
      style={{ width: '100%' }}
      options={options}
      onChange={(value) => {
        setTableData((prev) =>
          prev.map((row) =>
            row.key === record.key
              ? { ...row, position: value }
              : row
          )
        );
      }}
    />
  );
};

const columns = [
  { title: 'Run In', dataIndex: 'runin' },
  { title: 'Rack', render: rackColumn },
  { title: 'Position', render: positionColumn },
  { title: 'Action', render: actionColumn },
];

  return (
    <Table columns={columns} dataSource={tableData} bordered />
  )
};
export default TEMaintenance;