import { useEffect, useState } from 'react';

import { Button, ClientTable, Heading, SearchBar, Sheet } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import type { Group } from '@opendatacapture/schemas/group';
import { Link } from 'react-router-dom';

import { PageHeader } from '@/components/PageHeader';

import { useDeleteGroupMutation } from '../hooks/useDeleteGroupMutation';
import { useGroupsQuery } from '../hooks/useGroupsQuery';

export const ManageGroupsPage = () => {
  const { t } = useTranslation();
  const groupsQuery = useGroupsQuery();
  const deleteGroupMutation = useDeleteGroupMutation();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groups, setGroups] = useState<Group[]>(groupsQuery.data);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setGroups(groupsQuery.data.filter((group) => group.name.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [groupsQuery.data, searchTerm]);

  return (
    <Sheet open={Boolean(selectedGroup)} onOpenChange={() => setSelectedGroup(null)}>
      <PageHeader>
        <Heading className="text-center" variant="h2">
          {t({
            en: 'Manage Groups',
            fr: 'Gérer les groupes'
          })}
        </Heading>
      </PageHeader>
      <div className="mb-3 flex gap-3">
        <SearchBar
          className="flex-grow"
          placeholder={t({
            en: 'Search by Group Name',
            fr: 'Recherche par nom de groupe'
          })}
          value={searchTerm}
          onValueChange={setSearchTerm}
        />
        <Button asChild variant="outline">
          <Link to="create">
            {t({
              en: 'Add Group',
              fr: 'Ajouter un groupe'
            })}
          </Link>
        </Button>
      </div>
      <ClientTable<Group>
        columns={[
          {
            field: 'name',
            label: t('common.groupName')
          },
          {
            field: ({ type }) => {
              if (type === 'CLINICAL') {
                return t('common.clinical');
              } else if (type === 'RESEARCH') {
                return t('common.research');
              }
              return type satisfies never;
            },
            label: t('common.groupType')
          }
        ]}
        data={groups}
        entriesPerPage={15}
        minRows={15}
        onEntryClick={setSelectedGroup}
      />
      <Sheet.Content>
        <Sheet.Header>
          <Sheet.Title>{selectedGroup?.name}</Sheet.Title>
          <Sheet.Description>
            {t({
              en: 'Make changes to this group here. Click save when you are done.',
              fr: 'Apportez des modifications à ce groupe ici. Cliquez sur enregistrer lorsque vous avez terminé.'
            })}
          </Sheet.Description>
        </Sheet.Header>
        <Sheet.Body className="grid gap-4"></Sheet.Body>
        <Sheet.Footer>
          <Button
            className="w-full"
            type="button"
            variant="danger"
            onClick={() => {
              deleteGroupMutation.mutate({ id: selectedGroup!.id });
              setSelectedGroup(null);
            }}
          >
            {t('core.delete')}
          </Button>
          <Sheet.Close asChild>
            <Button disabled className="w-full" type="submit">
              {t('core.save')}
            </Button>
          </Sheet.Close>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet>
  );
};