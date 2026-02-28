


from collections import deque
import heapq

GRID_SIZE = 20


# =========================
# BFS ALGORITHM
# =========================
def bfs(snake, food):
    start = tuple(snake[0])
    target = tuple(food)
    snake_body = set(tuple(segment) for segment in snake)

    queue = deque([(start, [])])
    visited = set([start])

    directions = {
        "UP": (-1, 0),
        "DOWN": (1, 0),
        "LEFT": (0, -1),
        "RIGHT": (0, 1)
    }

    while queue:
        current, path = queue.popleft()

        if current == target:
            return path[0] if path else "RIGHT"

        for move, (dx, dy) in directions.items():
            new_pos = (current[0] + dx, current[1] + dy)

            if (
                0 <= new_pos[0] < GRID_SIZE and
                0 <= new_pos[1] < GRID_SIZE and
                new_pos not in snake_body and
                new_pos not in visited
            ):
                visited.add(new_pos)
                queue.append((new_pos, path + [move]))

    return "RIGHT"  # fallback


# =========================
# A* ALGORITHM
# =========================
def heuristic(a, b):
    # Manhattan Distance
    return abs(a[0] - b[0]) + abs(a[1] - b[1])


def astar(snake, food):
    start = tuple(snake[0])
    target = tuple(food)
    snake_body = set(tuple(segment) for segment in snake)

    open_set = []
    heapq.heappush(open_set, (0, start, []))

    g_score = {start: 0}
    visited = set()

    directions = {
        "UP": (-1, 0),
        "DOWN": (1, 0),
        "LEFT": (0, -1),
        "RIGHT": (0, 1)
    }

    while open_set:
        _, current, path = heapq.heappop(open_set)

        if current == target:
            return path[0] if path else "RIGHT"

        visited.add(current)

        for move, (dx, dy) in directions.items():
            new_pos = (current[0] + dx, current[1] + dy)

            if (
                0 <= new_pos[0] < GRID_SIZE and
                0 <= new_pos[1] < GRID_SIZE and
                new_pos not in snake_body
            ):
                tentative_g = g_score[current] + 1

                if new_pos not in g_score or tentative_g < g_score[new_pos]:
                    g_score[new_pos] = tentative_g
                    f_score = tentative_g + heuristic(new_pos, target)
                    heapq.heappush(open_set, (f_score, new_pos, path + [move]))

    return "RIGHT"  # fallback


# =========================
# MAIN SWITCH FUNCTION
# =========================
def get_next_move(data, algorithm="bfs"):
    snake = data["snake"]
    food = data["food"]

    if algorithm == "astar":
        return astar(snake, food)
    else:
        return bfs(snake, food)