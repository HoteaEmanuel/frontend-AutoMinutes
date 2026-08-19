import TodosTemplate from '@templates/TodosTemplate/TodosTemplate';
import { usePageTitle } from '@/hooks/usePageTitle';

const TodosPage = () => {
  usePageTitle('To-dos');
  return (
    <div className="page-container">
      <TodosTemplate />
    </div>
  );
};

export default TodosPage;
