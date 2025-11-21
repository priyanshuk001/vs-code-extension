#include <iostream>
#include <vector>
#include <sstream>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxArea(vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int maxArea = 0;

        while (left < right) {
            // Calculate area
            int currentArea = (right - left) * min(height[left], height[right]);
            maxArea = max(maxArea, currentArea);

            // Move the pointer pointing to the smaller height
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }

        return maxArea;
    }
};

int main() {
    // Input as a string
    string input;
    getline(cin, input);
    // link  https://leetcode.com/problems/container-with-most-water/description/
    // Use stringstream to parse the input into a vector
    stringstream ss(input);
    vector<int> height;
    int num;

    // Read each integer from the input string and add to the vector
    while (ss >> num) {
        height.push_back(num);
        if (ss.peek() == ',') {
            ss.ignore();
        }
    }

    // Create a Solution object and call the maxArea function
    Solution sol;
    int result = sol.maxArea(height);

    // Output the result
    cout << result << endl;

    return 0;
}