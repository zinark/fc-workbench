namespace FCHttpRequestEngine.Extensions
{
    public class Traverser<T>
    {
        private Func<T, IEnumerable<T>> _f;
        List<T> _stack = new();

        public void Traverse(T root, Func<T, IEnumerable<T>> f)
        {
            _f = f;
            _stack.Clear();
            Traverse(root);
        }

        public void TraverseAll(IEnumerable<T> roots, Func<T, IEnumerable<T>> f)
        {
            _f = f;
            _stack.Clear();
            foreach (var root in roots)
            {
                Traverse(root);
            }
        }

        void Traverse(T given)
        {
            if (given == null) return;

            _stack.Add(given);
            var children = _f(given);

            if (children == null) return;

            foreach (var child in children)
            {
                Traverse(child);
            }
        }

        public IEnumerable<T> GetStack()
        {
            return _stack;
        }
    }
}
