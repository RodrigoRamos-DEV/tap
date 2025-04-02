import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserProfiles, deleteProfile } from '../services/authService';
import { Table, Button, Modal, message, Card, Input, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import './Dashboard.css';

const Dashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const data = await getUserProfiles();
      setProfiles(data);
    } catch (error) {
      message.error('Erro ao carregar perfis');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchText.toLowerCase()) ||
    profile.slug.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'URL',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug) => (
        <a href={`/${slug}`} target="_blank" rel="noopener noreferrer">
          /{slug}
        </a>
      ),
    },
    {
      title: 'Redes Sociais',
      key: 'social',
      render: (_, record) => (
        <div className="social-tags">
          {record.instagram && <Tag color="#E1306C">Instagram</Tag>}
          {record.facebook && <Tag color="#3b5998">Facebook</Tag>}
          {record.whatsapp && <Tag color="#25D366">WhatsApp</Tag>}
          {record.linkedin && <Tag color="#0077B5">LinkedIn</Tag>}
        </div>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <div className="actions">
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/${record.slug}`)}
            target="_blank"
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/edit-profile/${record.slug}`)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setProfileToDelete(record);
              setDeleteModalVisible(true);
            }}
          />
        </div>
      ),
    },
  ];

  const handleDelete = async () => {
    try {
      await deleteProfile(profileToDelete.slug);
      message.success('Perfil deletado com sucesso');
      fetchProfiles();
    } catch (error) {
      message.error('Erro ao deletar perfil');
    } finally {
      setDeleteModalVisible(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Card
        title="Meus Cartões Digitais"
        extra={
          <Link to="/card-form">
            <Button type="primary" icon={<PlusOutlined />}>
              Criar Novo
            </Button>
          </Link>
        }
      >
        <div className="search-bar">
          <Input
            placeholder="Buscar perfis..."
            prefix={<SearchOutlined />}
            onChange={handleSearch}
            value={searchText}
            allowClear
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredProfiles}
          rowKey="slug"
          loading={loading}
          pagination={{ pageSize: 8 }}
        />

        <Modal
          title="Confirmar Exclusão"
          visible={deleteModalVisible}
          onOk={handleDelete}
          onCancel={() => setDeleteModalVisible(false)}
          okText="Deletar"
          cancelText="Cancelar"
          okButtonProps={{ danger: true }}
        >
          <p>Tem certeza que deseja deletar o perfil <strong>{profileToDelete?.name}</strong>?</p>
          <p>Esta ação não pode ser desfeita.</p>
        </Modal>
      </Card>
    </div>
  );
};

export default Dashboard;