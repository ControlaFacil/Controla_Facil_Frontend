import React, { useState, useEffect } from 'react';
import { X, UploadCloud, Trash2, Star, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './style/ModalProdutos.module.css';

// --- DND Sortable Item Component ---
function SortableImage({ image, onDelete, onHighlight }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.imageCard} ${image.isHighlight ? styles.isHighlight : ''}`}
    >
      {image.isHighlight && <div className={styles.highlightBadge}>Destaque</div>}
      
      {/* Drag Handle */}
      <div 
        className={styles.dragHandle}
        {...attributes} 
        {...listeners}
        style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(255,255,255,0.7)', borderRadius: '50%', padding: '4px', cursor: 'grab', zIndex: 3 }}
      >
        <GripVertical size={16} color="#333" />
      </div>

      <img src={image.url} alt="Preview" />
      <div className={styles.imageActions}>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onHighlight(image.id); }}
          className={`${styles.actionBtn} ${styles.highlightBtn}`}
          title="Definir como Destaque"
        >
          <Star size={14} fill={image.isHighlight ? "#f1c40f" : "none"} color={image.isHighlight ? "#f1c40f" : "white"} />
          <span style={{ marginLeft: '4px' }}>Destaque</span>
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(image.id); }}
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
          title="Excluir imagem"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export function ModalProdutos({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState(1);

  // --- Aba 1: Dados do Produto ---
  const [formData, setFormData] = useState({
    titulo: '',
    sku: '',
    categoria: '',
    categoriaML: '',
    preco: '',
    gtin: '',
    condicao: 'new',
    descricao: '',
    estoqueAtual: '',
    estoqueMinimo: '',
  });

  // --- Aba 2: Características ---
  const [characteristics, setCharacteristics] = useState({
    marca: '',
    modelo: '',
    cor: '',
    material: '',
  });

  // --- Aba 3: Imagens ---
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(1);
      setFormData({
        titulo: '',
        sku: '',
        categoria: '',
        categoriaML: '',
        preco: '',
        gtin: '',
        condicao: 'new',
        descricao: '',
        estoqueAtual: '',
        estoqueMinimo: '',
      });
      setCharacteristics({
        marca: '',
        modelo: '',
        cor: '',
        material: '',
      });
      setImages([]);
    }
  }, [isOpen]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5,
        },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!isOpen) return null;

  // Handlers para o Form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'preco') {
        // Mascara monetária simples (permite apenas numeros e virgula)
        let val = value.replace(/\D/g, '');
        val = (val / 100).toFixed(2) + '';
        val = val.replace(".", ",");
        val = val.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
        val = val.replace(/(\d)(\d{3}),/g, "$1.$2,");
        setFormData({ ...formData, [name]: val });
        return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleCharChange = (e) => {
    const { name, value } = e.target;
    setCharacteristics({ ...characteristics, [name]: value });
  };

  // Handlers para Imagens
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      isHighlight: images.length === 0, // A primeira vira destaque automaticamente
    }));

    // Atualiza garantindo que só há um destaque
    let updatedImages = [...images, ...newImages];
    if (images.length === 0 && updatedImages.length > 0) {
        updatedImages[0].isHighlight = true;
    }
    
    setImages(updatedImages);
    e.target.value = null;
  };

  const handleDeleteImage = (id) => {
    const updatedImages = images.filter((img) => img.id !== id);
    // Se apagou a destaque, passa pra próxima
    if (images.find(img => img.id === id)?.isHighlight && updatedImages.length > 0) {
        updatedImages[0].isHighlight = true;
    }
    setImages(updatedImages);
  };

  const handleSetHighlight = (id) => {
    setImages(
      images.map((img) => ({
        ...img,
        isHighlight: img.id === id,
      }))
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Finalização (Salvar Produto)
  const handleSave = () => {
    // Montando JSON final mockado
    const mlAttributes = [
        { id: "BRAND", value_name: characteristics.marca },
        { id: "MODEL", value_name: characteristics.modelo },
        { id: "COLOR", value_name: characteristics.cor },
        { id: "MATERIAL", value_name: characteristics.material },
    ].filter(attr => attr.value_name.trim() !== '');

    const payload = {
        ...formData,
        preco: parseFloat(formData.preco.replace(/\./g, '').replace(',', '.')), // Converte para float
        attributes: mlAttributes,
        images: images.map((img, index) => ({
             id: img.id,
             isHighlight: img.isHighlight,
             order: index
        }))
    };

    console.log("Produto a ser salvo:", payload);
    alert("Produto mockado gerado com sucesso! Verifique o console para os dados.");
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>Cadastrar Novo Produto</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tabBtn} ${activeTab === 1 ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(1)}
          >
            Dados do Produto
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 2 ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(2)}
          >
            Características
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 3 ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(3)}
          >
            Imagens
          </button>
        </div>

        <div className={styles.modalBody}>
          {activeTab === 1 && (
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label>Título do Anúncio</label>
                <input type="text" name="titulo" value={formData.titulo} onChange={handleFormChange} placeholder="Ex: Teclado Mecânico Gamer" />
              </div>
              <div className={styles.inputGroup}>
                <label>SKU</label>
                <input type="text" name="sku" value={formData.sku} onChange={handleFormChange} placeholder="Ex: TEC-GAMER-01" />
              </div>
              <div className={styles.inputGroup}>
                <label>Categoria Interna</label>
                <select name="categoria" value={formData.categoria} onChange={handleFormChange}>
                  <option value="">Selecione uma categoria interna...</option>
                  <option value="eletronicos">Eletrônicos</option>
                  <option value="informatica">Informática</option>
                  <option value="casa_decoracao">Casa e Decoração</option>
                  <option value="moda">Moda</option>
                  <option value="esportes">Esportes</option>
                  <option value="beleza">Beleza e Cuidado Pessoal</option>
                  <option value="ferramentas">Ferramentas</option>
                  <option value="brinquedos">Brinquedos</option>
                  <option value="automotivo">Automotivo</option>
                  <option value="saude">Saúde</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Condição</label>
                <select name="condicao" value={formData.condicao} onChange={handleFormChange}>
                  <option value="new">Novo</option>
                  <option value="used">Usado</option>
                  <option value="not_specified">Não Especificado</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Preço de Venda (R$)</label>
                <input type="text" name="preco" value={formData.preco} onChange={handleFormChange} placeholder="0,00" />
              </div>
              <div className={styles.inputGroup}>
                <label>GTIN / EAN</label>
                <input type="text" name="gtin" value={formData.gtin} onChange={handleFormChange} placeholder="Apenas números" pattern="\d*" />
              </div>
              <div className={styles.inputGroup}>
                <label>Estoque Atual</label>
                <input type="number" name="estoqueAtual" value={formData.estoqueAtual} onChange={handleFormChange} min="0" />
              </div>
              <div className={styles.inputGroup}>
                <label>Estoque Mínimo</label>
                <input type="number" name="estoqueMinimo" value={formData.estoqueMinimo} onChange={handleFormChange} min="0" />
              </div>
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label>Descrição do Produto</label>
                <textarea name="descricao" value={formData.descricao} onChange={handleFormChange} placeholder="Detalhes do produto..."></textarea>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className={styles.formGrid}>
              <p className={styles.fullWidth} style={{ color: '#64748b', fontSize: '0.95rem' }}>
                Preencha os atributos abaixo para melhorar o ranqueamento do seu anúncio no Mercado Livre. Campos gerados dinamicamente com base na categoria.
              </p>
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label>Categoria Mercado Livre</label>
                <select name="categoriaML" value={formData.categoriaML} onChange={handleFormChange}>
                  <option value="">Selecione a categoria do Mercado Livre...</option>
                  <option value="MLB1051">Celulares e Telefones</option>
                  <option value="MLB1648">Informática -Componentes</option>
                  <option value="MLB1430">Roupas e Calçados</option>
                  <option value="MLB271599">Eletrônicos, Áudio e Vídeo</option>
                  <option value="MLB5726">Eletrodomésticos</option>
                  <option value="MLB1574">Casa, Móveis e Decoração</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Marca</label>
                <input type="text" name="marca" value={characteristics.marca} onChange={handleCharChange} placeholder="Ex: Redragon" />
              </div>
              <div className={styles.inputGroup}>
                <label>Modelo</label>
                <input type="text" name="modelo" value={characteristics.modelo} onChange={handleCharChange} placeholder="Ex: Mitra K551" />
              </div>
              <div className={styles.inputGroup}>
                <label>Cor</label>
                <input type="text" name="cor" value={characteristics.cor} onChange={handleCharChange} placeholder="Ex: Preto" />
              </div>
              <div className={styles.inputGroup}>
                <label>Material</label>
                <input type="text" name="material" value={characteristics.material} onChange={handleCharChange} placeholder="Ex: Plástico ABS e Metal" />
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div>
              <label className={styles.uploadContainer}>
                <UploadCloud size={48} className={styles.uploadIcon} />
                <div className={styles.uploadText}>
                  Arraste e solte imagens aqui ou <span>clique para selecionar</span>
                </div>
                <input
                  type="file"
                  className={styles.hiddenInput}
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>

              {images.length > 0 && (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={images.map((i) => i.id)} strategy={rectSortingStrategy}>
                    <div className={styles.imagesGrid}>
                      {images.map((img) => (
                        <SortableImage
                          key={img.id}
                          image={img}
                          onDelete={handleDeleteImage}
                          onHighlight={handleSetHighlight}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.btnCancel} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.btnSubmit} onClick={handleSave}>
            Cadastrar Produto
          </button>
        </div>
      </div>
    </div>
  );
}
