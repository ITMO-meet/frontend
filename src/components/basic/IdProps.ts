/**
 * Интерфейс `IdProps` предназначен для предоставления опционального идентификатора `id` для компонентов.
 * Это позволяет компонентам принимать `id` в качестве пропса, что может быть полезно для целей тестирования,
 * стилизации и уникальной идентификации элементов на странице.
 *
 * Пример использования:
 * ```typescript
 * interface MyComponentProps extends IdProps {
 *     name: string;
 * }
 *
 * const MyComponent: React.FC<MyComponentProps> = ({ id, name }) => (
 *     <div id={id}>
 *         {name}
 *     </div>
 * );
 * ```
 */
interface IdProps {
    id?: string;
}

export default IdProps;
