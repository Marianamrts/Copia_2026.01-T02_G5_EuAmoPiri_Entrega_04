/**
 * PÁGINA — EditExperiencePage  (RF05: Edição de Relato de Experiência)
 */
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchExperiencesByPlace, updateExperience } from '../infra/adaptor/experienceAdaptor';
import ExperienceForm from '../presentation/organisms/ExperienceForm';
import Spinner from '../presentation/atoms/Spinner';
import styles from './CreateExperiencePage.module.css'; /* reutiliza o css */

export default function EditExperiencePage() {
  const { placeId, id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchExperiencesByPlace(placeId).then((exps) => {
      setExperience(exps.find((e) => String(e.id) === String(id)) ?? null);
      setLoading(false);
    });
  }, [placeId, id]);

  async function handleSubmit(data) {
    setSaving(true);
    try {
      await updateExperience(placeId, id, data);
      navigate(`/locais/${placeId}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className={styles.page}><div style={{display:'flex',justifyContent:'center',padding:'4rem'}}><Spinner size="lg" /></div></div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link to={`/locais/${placeId}`} className={styles.back}>← Voltar ao local</Link>
        </nav>
        <h1 className={styles.title}>Editar relato</h1>
        <div className={styles.formCard}>
          <ExperienceForm
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/locais/${placeId}`)}
            loading={saving}
            defaultValues={experience ?? {}}
          />
        </div>
      </div>
    </div>
  );
}
