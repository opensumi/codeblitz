import { createContainer } from '../container';
import { EditorProps } from './types';

const { Container, select, onSelect, useSelector } = createContainer<EditorProps>();

export { Container, select, onSelect, useSelector };
