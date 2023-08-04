import React from 'react';

import { Modal } from '@douglasneuroinformatics/ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { SubjectsAPI } from '../api/subjects-api';

import { IdentificationForm, IdentificationFormData } from '@/components';

interface SubjectLookupProps {
  show: boolean;
  onClose: () => void;
}

export const SubjectLookup = ({ show, onClose }: SubjectLookupProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const lookupSubject = (formData: IdentificationFormData) => {
    SubjectsAPI.lookupSubject(formData)
      .then(({ data: { identifier } }) => {
        navigate(identifier);
      })
      .catch((error) => console.error(error));
  };

  return (
    <Modal open={show} title={t('viewSubjects.lookup.title')} onClose={onClose}>
      <div>
        <IdentificationForm fillActiveSubject onSubmit={lookupSubject} />
      </div>
    </Modal>
  );
};