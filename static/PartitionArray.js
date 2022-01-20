function emptyFunc() {};

class PartitionArray {
    /**
     * @param {number} length total number of elements
     * @param {number} partitions number of partitions
     */
    constructor(length, partitions) {
        this.arr = new Array(length);
        this.part_i = new Array(partitions);
        this.part_end = new Array(partitions);

        this.part_i[0] = 0;
        this.part_end[partitions-1] = length;
        const block = Math.floor(length/partitions);
        for(var i=1; i<partitions; i++) {
            this.part_i[i] = this.part_end[i-1] = block*i;
        }
    }
    /**
     * Adds an element to a partition
     * @param {number} i partition index
     * @param {*} obj object to add
     */
    push(i, obj) {
        if(this.part_i[i] === this.part_end[i]) {
            if(i < 20) console.log(i, this.part_i[i], this.part_end[i]);
            this.push(i+1, this.arr[this.part_end[i]]);
            this.part_end[i]++;
        }
        this.arr[this.part_i[i]++] = obj;
    }
    /**
     * 
     * @param {function} pre executed before each partition
     * @param {function} callback executed for each element of a partition
     * @param {function} post executed after each partition
     */
    forEach(pre, callback, post) {
        if(!pre) pre = emptyFunc;
        if(!post) post = emptyFunc;
        let i;
        let j=0;
        let N;
        const LEN = this.part_end.length;
        for(i=0; i<LEN; i++) {
            pre(i);
            N = this.part_end[i];
            for(; j<N; j++) callback(this.arr[j]);
            post(i);
        }
    }
}

module.exports = PartitionArray;