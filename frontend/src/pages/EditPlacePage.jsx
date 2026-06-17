import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { fetchPlaceById, updatePlace } from '../infra/adaptor/placeAdaptor';
import Button from '../presentation/atoms/Button';
import Spinner from '../presentation/atoms/Spinner';
import FormField from '../presentation/molecules/FormField';
import styles from './EditPlacePage.module.css';
import createStyles from './CreatePlacePage.module.css';

const CATEGORY_OPTIONS = [
  { value: 'gastronomia', label: 'Gastronomia' },
  { value: 'natureza',    label: 'Natureza' },
  { value: 'hospedagem',  label: 'Hospedagem' },
  { value: 'cultura',     label: 'Cultura' },
  { value: 'compras',     label: 'Compras' },
  { value: 'aventura',    label: 'Aventura' },
];

const PRICE_OPTIONS = ['$', '$$', '$$$', '$$$$', '$$$$$'];

export default function EditPlacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo ?? '/perfil';
  const fileInputRef = useRef(null);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'
  // allPhotos: [{ url: string, isNew: boolean }] — 1ª é sempre a capa
  const [allPhotos, setAllPhotos]       = useState([]);
  const [dragOver, setDragOver]         = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchPlaceById(id)
      .then((place) => {
        reset({
          name:        place.name        ?? '',
          category:    place.category    ?? '',
          description: place.description ?? '',
          address:     place.address     ?? '',
          price:       place.price       ?? '',
          hours:       place.hours       ?? '',
          phone:       place.phone       ?? '',
        });
        // Carrega todas as fotos existentes; garante que a capa é sempre a primeira
        const existing = Array.isArray(place.photos) && place.photos.length > 0
          ? place.photos
          : place.coverImage ? [place.coverImage] : [];
        setAllPhotos(existing.map((url) => ({ url, isNew: false })));
      })
      .finally(() => setLoading(false));
  }, [id, reset]);

  /* ── Gerenciamento de fotos ── */
  function addFiles(fileList) {
    const remaining = 3 - allPhotos.length;
    if (remaining <= 0) return;
    const newItems = Array.from(fileList)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, remaining)
      .map((file) => ({ url: URL.createObjectURL(file), isNew: true }));
    setAllPhotos((prev) => [...prev, ...newItems]);
  }

  function removePhoto(index) {
    setAllPhotos((prev) => {
      if (prev[index].isNew) URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }

  function setCover(index) {
    setAllPhotos((prev) => {
      const next = [...prev];
      const [chosen] = next.splice(index, 1);
      return [chosen, ...next];
    });
  }

  function handleFileChange(e) { addFiles(e.target.files); e.target.value = ''; }
  function handleDrop(e) { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }

  async function onSubmit(data) {
    setSaving(true);
    try {
      const photoUrls = allPhotos.map((p) => p.url);
      await updatePlace(id, {
        ...data,
        coverImage: photoUrls[0] ?? null,
        photos: photoUrls,
      });
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.centered}>
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ── Overlay de sucesso ── */}
      {submitStatus === 'success' && (
        <div className={styles.resultOverlay} role="dialog" aria-modal="true">
          <div className={styles.resultCard}>
            <p className={styles.resultLogo}>❤ EuAmoPiri</p>
            <span className={styles.resultIcon} aria-hidden="true">✓</span>
            <h2 className={styles.resultTitle}>Local atualizado com sucesso!</h2>
            <p className={styles.resultText}>As alterações foram salvas.</p>
            <div className={styles.resultActions}>
              <Button variant="primary" fullWidth as={Link} to={returnTo}>
                {returnTo.startsWith('/locais/') ? 'Ver local' : returnTo === '/locais' ? 'Voltar a Locais' : 'Voltar ao meu perfil'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Overlay de erro ── */}
      {submitStatus === 'error' && (
        <div className={styles.resultOverlay} role="dialog" aria-modal="true">
          <div className={styles.resultCard}>
            <p className={styles.resultLogo}>❤ EuAmoPiri</p>
            <span className={styles.resultIcon} aria-hidden="true">⚠️</span>
            <h2 className={styles.resultTitle}>Falha ao salvar alterações</h2>
            <p className={styles.resultText}>Verifique os dados e tente novamente.</p>
            <div className={styles.resultActions}>
              <Button variant="neutral" fullWidth onClick={() => setSubmitStatus(null)}>
                Voltar ao formulário
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.container}>
        <nav>
          <Button variant="neutral" size="sm" as={Link} to={returnTo}>
            ← Voltar
          </Button>
        </nav>

        <h1 className={styles.title}>Editar local</h1>

        <form className={styles.formCard} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.formGrid}>
            <FormField
              id="name"
              label="Nome do local"
              placeholder="Nome do local"
              registration={register('name', { required: 'Nome é obrigatório' })}
              error={errors.name?.message}
            />
            <div className={styles.selectGroup}>
              <label className={styles.selectLabel} htmlFor="category">Categoria</label>
              <select
                id="category"
                className={styles.select}
                {...register('category')}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <FormField
              id="address"
              label="Endereço"
              placeholder="Endereço do local"
              registration={register('address')}
            />
            <div className={styles.selectGroup}>
              <label className={styles.selectLabel} htmlFor="price">Faixa de preço</label>
              <select
                id="price"
                className={styles.select}
                {...register('price')}
              >
                {PRICE_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <FormField
              id="hours"
              label="Horário de funcionamento"
              placeholder="Ex: 11h - 22h"
              registration={register('hours')}
            />
            <FormField
              id="phone"
              label="Telefone"
              placeholder="Ex: (62) 3331-1234"
              registration={register('phone')}
            />
          </div>

          <FormField
            id="description"
            label="Descrição"
            multiline
            rows={4}
            maxLength={500}
            placeholder="Descreva o local..."
            registration={register('description')}
          />

          {/* ── Fotos ── */}
          <div className={createStyles.photosSection}>
            <p className={createStyles.photosLabel}>
              Fotos{' '}
              <span className={createStyles.photosHint}>(até 3 — a 1ª é a foto de capa)</span>
            </p>

            {/* Grid de todas as fotos */}
            {allPhotos.length > 0 && (
              <div className={createStyles.previewGrid}>
                {allPhotos.map(({ url }, index) => (
                  <div key={url} className={createStyles.previewItem}>
                    <img src={url} alt={`Foto ${index + 1}`} className={createStyles.previewImg} />
                    {/* Badge de capa */}
                    {index === 0 && (
                      <span className={styles.capaBadge}>Capa</span>
                    )}
                    {/* Botão remover */}
                    <button
                      type="button"
                      className={createStyles.removePreviewBtn}
                      onClick={() => removePhoto(index)}
                      aria-label={`Remover foto ${index + 1}`}
                    >✕</button>
                    {/* Definir como capa (só para não-primeiras) */}
                    {index > 0 && (
                      <button
                        type="button"
                        className={styles.setCoverBtn}
                        onClick={() => setCover(index)}
                        title="Definir como foto de capa"
                      >⭐</button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Zona de upload */}
            {allPhotos.length < 3 && (
              <div
                className={`${createStyles.uploadZone} ${dragOver ? createStyles.dragOver : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                aria-label="Clique ou arraste para adicionar foto"
              >
                <span className={createStyles.uploadIcon} aria-hidden="true">☁</span>
                <p className={createStyles.uploadText}>
                  {allPhotos.length === 0
                    ? 'Clique ou arraste para adicionar fotos'
                    : `${3 - allPhotos.length} vaga(s) restante(s)`}
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className={createStyles.fileInput}
              onChange={handleFileChange}
              aria-hidden="true"
            />
          </div>

          <div className={styles.formActions}>
            <Button variant="neutral" type="button" onClick={() => navigate(returnTo)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" loading={saving}>
              Salvar alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
