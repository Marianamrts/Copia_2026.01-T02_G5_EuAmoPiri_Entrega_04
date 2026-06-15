/**
 * PÁGINA — CreateExperiencePage  (RF05: Cadastro de Relato de Experiência)
 *
 * Página standalone para turista cadastrar um relato em um local.
 * Usa o organismo ExperienceForm.
 */
import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createExperience } from '../infra/adaptor/experienceAdaptor';
import { useAuth } from '../context/AuthContext';
import ExperienceForm from '../presentation/organisms/ExperienceForm';
import Spinner from '../presentation/atoms/Spinner';
import styles from './CreateExperiencePage.module.css';

export default function CreateExperiencePage() {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(data) {
    setLoading(true);
    try {
      await createExperience(placeId, {
        ...data,
        userName: user?.name ?? 'Turista',
        reactions: { heart: 0, gem: 0 },
        createdAt: new Date().toISOString(),
      });
      navigate(`/locais/${placeId}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link to={`/locais/${placeId}`} className={styles.back}>← Voltar ao local</Link>
        </nav>
        <h1 className={styles.title}>Novo relato</h1>
        <div className={styles.formCard}>
          <ExperienceForm
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/locais/${placeId}`)}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
