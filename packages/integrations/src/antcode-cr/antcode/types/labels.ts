export interface Label {
  shouldRemoveSourceBranch: Label;
  id: number;
  color: string;
  description: string;
  sourceType: string;
  name?: string;
  title?: string;
  groupId?: number;
  tenantId?: number;
  template?: boolean;
  projectId?: number;
  createdAt?: string; //date
  updatedAt?: string; // date
}

export type LabelPick = Pick<Label, 'name' | 'description' | 'color'> & {
  newName?: string;
};
