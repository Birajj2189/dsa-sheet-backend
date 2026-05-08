export interface SubtopicSeed {
  title: string;
  slug: string;
  description: string;
  articleLink?: string;
  order: number;
}

export const subtopicsData: Record<string, SubtopicSeed[]> = {
  arrays: [
    { title: 'Two Pointers', slug: 'two-pointers', description: 'Solve problems using two pointer technique', order: 1 },
    { title: 'Sliding Window', slug: 'sliding-window', description: 'Fixed and variable size sliding window patterns', order: 2 },
    { title: 'Prefix Sum', slug: 'prefix-sum', description: 'Precompute prefix sums for range queries', order: 3 },
    { title: 'Kadane\'s Algorithm', slug: 'kadanes-algorithm', description: 'Maximum subarray and related problems', order: 4 },
  ],
  strings: [
    { title: 'String Hashing', slug: 'string-hashing', description: 'Anagrams, frequency maps, and hashing tricks', order: 1 },
    { title: 'Palindromes', slug: 'palindromes', description: 'Palindrome detection, expansion, and construction', order: 2 },
    { title: 'Pattern Matching', slug: 'pattern-matching', description: 'KMP, Rabin-Karp, Z-algorithm', order: 3 },
  ],
  'linked-lists': [
    { title: 'Reversal', slug: 'reversal', description: 'Reverse full list, portions, and in-place reversal', order: 1 },
    { title: 'Cycle Detection', slug: 'cycle-detection', description: 'Floyd\'s cycle algorithm and entry point finding', order: 2 },
    { title: 'Merge Operations', slug: 'merge-operations', description: 'Merge sorted lists and partition', order: 3 },
  ],
  'stacks-queues': [
    { title: 'Monotonic Stack', slug: 'monotonic-stack', description: 'Next greater/smaller element problems', order: 1 },
    { title: 'Stack Design', slug: 'stack-design', description: 'Design stack with special features', order: 2 },
  ],
  trees: [
    { title: 'Tree Traversal', slug: 'tree-traversal', description: 'Inorder, preorder, postorder, level-order', order: 1 },
    { title: 'Binary Search Tree', slug: 'binary-search-tree', description: 'BST operations, validation, and construction', order: 2 },
    { title: 'Tree Path Problems', slug: 'tree-path-problems', description: 'Path sum, diameter, LCA, and root-to-leaf paths', order: 3 },
  ],
  graphs: [
    { title: 'BFS / DFS', slug: 'bfs-dfs', description: 'Graph traversal and connected components', order: 1 },
    { title: 'Topological Sort', slug: 'topological-sort', description: 'Course schedule and dependency ordering', order: 2 },
    { title: 'Shortest Paths', slug: 'shortest-paths', description: 'Dijkstra, Bellman-Ford, and BFS shortest paths', order: 3 },
    { title: 'Union-Find', slug: 'union-find', description: 'Disjoint set union for connected components', order: 4 },
  ],
  'dynamic-programming': [
    { title: '1D DP', slug: '1d-dp', description: 'Linear DP: fibonacci, climbing stairs, house robber', order: 1 },
    { title: '2D DP', slug: '2d-dp', description: 'Grid DP, edit distance, and matrix chain', order: 2 },
    { title: 'Knapsack', slug: 'knapsack', description: '0/1 knapsack, unbounded, and partition problems', order: 3 },
    { title: 'Subsequences', slug: 'subsequences', description: 'LCS, LIS, and subsequence counting', order: 4 },
  ],
  backtracking: [
    { title: 'Combinations & Permutations', slug: 'combinations-permutations', description: 'Generate all combinations and permutations', order: 1 },
    { title: 'Subsets', slug: 'subsets', description: 'Generate power set and filtered subsets', order: 2 },
    { title: 'Constraint Satisfaction', slug: 'constraint-satisfaction', description: 'N-Queens, Sudoku, and word search', order: 3 },
  ],
};
